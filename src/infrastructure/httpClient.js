import { store } from './store';

export const httpClient = {
  apiUrl: import.meta.env.VITE_API_URL,

  async getAsync(url, data, useCache = true) {
    let endpointUrl;
    endpointUrl = data ? `${this.apiUrl}/${url}${this._serializeToQueryStringParams(data)}` : `${this.apiUrl}/${url}`;

    if (useCache) {
      return await this.cachedGetJsonAsync(endpointUrl);
    } else {
      const result = await fetch(endpointUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: this._createHeadersWithAuthorization(),
      });

      return await result.json();
    }
  },

  async postAsync(url, data) {
    const result = await fetch(`${this.apiUrl}/${url}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: this._createHeadersWithAuthorization(),
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return await result.json();
  },

  async uploadFileAsync(url, file) {
    const data = new FormData();
    data.append('image', file);
    data.append('name', file.name);

    const result = await fetch(`${this.apiUrl}/${url}`, {
      method: 'POST',
      cache: 'no-cache',
      headers: this._createHeadersWithAuthorization(false),
      body: data, // body data type must match "Content-Type" header
    });

    return await result.json();
  },

  async saveMediaAsync(url, filename) {
    const result = await fetch(url);
    const resultBlob = await result.blob();
    let blobUrl = window.URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  saveText(text, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async cachedGetJsonAsync(url) {
    // Use the URL as the cache key to sessionStorage
    const cacheKey = this._hashString(url);
    let cached = sessionStorage.getItem(cacheKey);
    if (cached !== null) {
      let response = new Response(new Blob([cached]));
      return await response.json();
    }

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      headers: this._createHeadersWithAuthorization(),
    });

    // let's only store in cache if the content-type is JSON
    if (response.status === 200) {
      let ct = response.headers.get('Content-Type');
      if (ct && ct.match(/application\/json/i)) {
        // There is a .json() instead of .text() but
        // we're going to store it in sessionStorage as
        // string anyway.
        // If we don't clone the response, it will be
        // consumed by the time it's returned. This
        // way we're being un-intrusive.
        const content = await response.clone().text();
        sessionStorage.setItem(cacheKey, content);
      }
    }

    return await response.json();
  },

  clearCache(url) {
    const absoluteUrl = `${this.apiUrl}/${url}`;
    const cacheKey = this._hashString(absoluteUrl);
    sessionStorage.removeItem(cacheKey);
  },

  _createHeadersWithAuthorization(sendContentType = true) {
    const headers = new Headers();
    if (sendContentType) {
      headers.append('Content-Type', 'application/json');
    }

    headers.append('X-Language', store.state.currentLanguage);

    const user = store.state.user;
    if (user !== null) {
      user.token
        ? headers.append('Authorization', `Bearer ${user.token}`)
        : headers.append('Authorization', user.token);
    }

    return headers;
  },

  _serializeToQueryStringParams(obj) {
    return '?' + new URLSearchParams(obj).toString();
  },

  _hashString(s) {
    let hash = 0;
    if (s.length === 0) return hash;
    for (let i = 0; i < s.length; i++) {
      let char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  },
};
