<template>
  <div class="token-controls">
    <label>Heading Font: <input type="text" v-model="fontTokens.heading" placeholder="e.g. Playfair Display" /></label>
    <label>Body Font: <input type="text" v-model="fontTokens.body" placeholder="e.g. Roboto" /></label>
    <label>UI Font: <input type="text" v-model="fontTokens.ui" placeholder="e.g. Roboto Mono" /></label>
    <div class="token-export">
      <button @click="exportStyleDictionary">Export Style Dictionary</button>
      <textarea readonly rows="10" cols="50" v-if="styleJSON">{{ styleJSON }}</textarea>
    </div>
  </div>
</template>

<script setup>
defineProps(['fontTokens', 'styleJSON', 'exportStyleDictionary'])
</script>