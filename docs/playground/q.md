---
title: Playground
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Blog - ElysiaJS

    - - meta
      - name: 'description'
        content: Update of ElysiaJS, from core maintainers

    - - meta
      - property: 'og:description'
        content: Update of ElysiaJS from core maintainers
---

<script setup lang="ts">
import TableEditor from '../components/xiao/table-editor/table-editor.vue'
import { ref } from 'vue'

const data = ref([])
</script>

<TableEditor :headers="['a', 'b']" :model="data" />
