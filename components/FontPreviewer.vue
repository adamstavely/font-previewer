<template>
  <div :class="['font-previewer', theme, { mobileMode }]">
    <FontControls
      v-model:search="search"
      v-model:selectedTag="selectedTag"
      v-model:sampleText="sampleText"
      v-model:fontSize="fontSize"
      v-model:fontWeight="fontWeight"
      v-model:lineHeight="lineHeight"
      v-model:letterSpacing="letterSpacing"
      v-model:textColor="textColor"
      v-model:bgColor="bgColor"
      :theme="theme"
      :mobileMode="mobileMode"
      :toggleTheme="toggleTheme"
    />

    <ComparisonView
      :comparisonFonts="comparisonFonts"
      :sampleText="sampleText"
    />

    <div class="font-grid">
      <FontCard
        v-for="font in filteredFonts"
        :key="font.name"
        :font="font"
        :fontSize="fontSize"
        :fontWeight="fontWeight"
        :lineHeight="lineHeight"
        :letterSpacing="letterSpacing"
        :textColor="textColor"
        :bgColor="bgColor"
        :sampleText="sampleText"
        :selected="isFavorite(font)"
        :copyFont="copyFont"
        :getCustomFilename="getCustomFilename"
        :toggleFavorite="toggleFavorite"
        :toggleCompare="toggleCompare"
        :getContrastLevel="getContrastLevel"
      />
    </div>

    <TokenExport
      :fontTokens="fontTokens"
      :styleJSON="styleJSON"
      :exportStyleDictionary="exportStyleDictionary"
    />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import FontControls from './FontControls.vue'
import FontCard from './FontCard.vue'
import ComparisonView from './ComparisonView.vue'
import TokenExport from './TokenExport.vue'
import { loadFont } from './useFontLoader'

import fontData from '../assets/fonts.json'

const search = ref('')
const selectedTag = ref('')
const sampleText = ref('The quick brown fox jumps over the lazy dog.')
const fontSize = ref(24)
const fontWeight = ref(400)
const lineHeight = ref(1.4)
const letterSpacing = ref(0)
const textColor = ref('#000000')
const bgColor = ref('#FFFFFF')
const theme = ref('light')
const mobileMode = ref(false)
const favorites = ref([])
const compareList = ref([])
const fontTokens = ref({
  heading: '',
  body: '',
  ui: ''
})
const styleJSON = ref('')

// Filter and lazy load
const filteredFonts = computed(() =>
  fontData.filter((font) => {
    return (
      (!search.value || font.name.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedTag.value || font.tags.includes(selectedTag.value))
    )
  })
)

const comparisonFonts = computed(() =>
  fontData.filter((f) => compareList.value.includes(f.name))
)

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function toggleFavorite(font) {
  const index = favorites.value.indexOf(font.name)
  if (index === -1) favorites.value.push(font.name)
  else favorites.value.splice(index, 1)
}

function isFavorite(font) {
  return favorites.value.includes(font.name)
}

function toggleCompare(font) {
  const index = compareList.value.indexOf(font.name)
  if (index === -1 && compareList.value.length < 3) compareList.value.push(font.name)
  else compareList.value.splice(index, 1)
}

function copyFont(font) {
  navigator.clipboard.writeText(font.url)
}

function getCustomFilename(font) {
  return font.name.toLowerCase().replace(/\s+/g, '-') + '.woff2'
}

function getContrastLevel(textColor, bgColor) {
  // Basic WCAG contrast checker using luminance
  function luminance(hex) {
    let rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255)
    rgb = rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4))
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  }
  const L1 = luminance(textColor)
  const L2 = luminance(bgColor)
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

function exportStyleDictionary() {
  const output = {
    font: {
      heading: {
        family: { value: fontTokens.value.heading },
        size: { value: fontSize.value + 'px' },
        weight: { value: fontWeight.value.toString() },
        lineHeight: { value: lineHeight.value },
        letterSpacing: { value: letterSpacing.value + 'px' }
      },
      body: {
        family: { value: fontTokens.value.body }
      },
      ui: {
        family: { value: fontTokens.value.ui }
      }
    }
  }
  const json = JSON.stringify(output, null, 2)
  styleJSON.value = json
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'style-dictionary.tokens.json'
  a.click()
  URL.revokeObjectURL(url)
}

watchEffect(() => {
  filteredFonts.value.forEach(font => {
    loadFont(font.name, font.url)
  })
})
</script>