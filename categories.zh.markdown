---
layout: page
lang: zh
title: 笔记
permalink: /categories/
nav: true
---

<div class="categories-page">
{%- assign lang_posts = site.posts | where: "lang", "zh" -%}
{%- assign cats = lang_posts | group_by_exp: "post", "post.categories | first" | sort: "name" -%}
{%- for cat in cats -%}
  {%- assign cat_name = cat.name -%}
  {%- assign cat_display = site.data.cat_names[cat_name].zh | default: cat_name -%}
  {%- assign cat_posts = cat.items -%}
  <div class="category-section" id="{{ cat_name | slugify }}">
    <h2 class="category-heading">{{ cat_display }} <small>({{ cat_posts.size }})</small></h2>
    <ul class="post-list">
      {%- for post in cat_posts -%}
      <li>
        {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
        <span class="post-meta">{{ post.date | date: date_format }}</span>
        <h3>
          <a class="post-link" href="{{ post.url | relative_url }}">
            {{ post.title | escape }}
          </a>
        </h3>
      </li>
      {%- endfor -%}
    </ul>
  </div>
{%- else -%}
  <p>暂无版块分类。</p>
{%- endfor -%}
</div>
