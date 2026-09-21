/*
  pageviews.js — 在笔记列表页显示每篇文章的访问量，无需进入文章详情。

  实现要点：
  1. 只调用 Vercount 公开计数接口的 GET 只读路由，浏览列表页不会给任何文章增加访问量。
  2. 结果缓存在 sessionStorage 中（5 分钟），避免来回翻页时重复请求。
  3. 任何请求失败（接口不可用、被拦截等）都静默处理，占位元素保持隐藏。
*/
(() => {
  'use strict';

  const API = 'https://events.vercount.one/api/v2/log';
  const CACHE_KEY = 'post-pageviews';
  const CACHE_TTL = 5 * 60 * 1000;
  const CONCURRENCY = 3;

  const nodes = Array.from(document.querySelectorAll('[data-post-views]'));
  if (nodes.length === 0) return;

  const cache = readCache();
  const queue = [];

  nodes.forEach((node) => {
    const url = node.getAttribute('data-post-views');
    if (!url) return;

    const cached = cache[url];
    if (cached && Date.now() - cached.t < CACHE_TTL) {
      render(node, cached.v);
    } else {
      queue.push({ node: node, url: url });
    }
  });

  for (let i = 0; i < Math.min(CONCURRENCY, queue.length); i += 1) {
    worker();
  }

  function readCache() {
    try {
      return JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function writeCache() {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      /* 隐私模式下不可写，忽略 */
    }
  }

  function render(node, value) {
    const target = node.querySelector('.post-views-value');
    if (!target) return;
    target.textContent = value.toLocaleString();
    node.hidden = false;
  }

  async function load(node, url) {
    const response = await fetch(API + '?url=' + encodeURIComponent(url), {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);

    const payload = await response.json();
    const data = payload && payload.data ? payload.data : payload;
    const value = Number(data && data.page_pv);
    if (!Number.isFinite(value)) throw new Error('unexpected payload');

    render(node, value);
    cache[url] = { v: value, t: Date.now() };
    writeCache();
  }

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      try {
        await load(item.node, item.url);
      } catch (e) {
        /* 静默失败：保持隐藏 */
      }
    }
  }
})();
