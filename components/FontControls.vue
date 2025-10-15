<template>
  <div class="controls">
    <!-- Left Side - Main Controls -->
    <div class="controls-left">
      <!-- Search and Filter Section -->
      <div class="search-section">
        <input 
          type="text" 
          :value="search" 
          @input="$emit('update:search', $event.target.value)" 
          placeholder="Search fonts..." 
          class="search-input"
        />
        <div class="filter-group">
          <select :value="selectedTag" @change="$emit('update:selectedTag', $event.target.value)" class="category-select">
            <option value="">All Categories</option>
            <option value="serif">Serif</option>
            <option value="sans-serif">Sans-serif</option>
            <option value="display">Display</option>
            <option value="monospace">Monospace</option>
            <option value="handwriting">Handwriting</option>
          </select>
          <select :value="selectedScript" @change="$emit('update:selectedScript', $event.target.value)" class="script-select">
            <option value="">All Scripts</option>
            <option value="latin">Latin</option>
            <option value="cyrillic">Cyrillic</option>
            <option value="arabic">Arabic</option>
            <option value="devanagari">Devanagari</option>
            <option value="chinese">Chinese</option>
          </select>
          <select :value="selectedWeight" @change="$emit('update:selectedWeight', $event.target.value)" class="weight-select">
            <option value="">All Weights</option>
            <option value="100">Thin (100)</option>
            <option value="200">Extra Light (200)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra Bold (800)</option>
            <option value="900">Black (900)</option>
          </select>
        </div>
      </div>

      <!-- Typography & Color Controls -->
      <div class="typography-controls">
        <div class="control-group">
          <label>Size: {{ fontSize }}px</label>
          <input 
            type="range" 
            :value="fontSize" 
            @input="$emit('update:fontSize', Number($event.target.value))" 
            min="12" 
            max="72" 
            class="range-slider"
          />
        </div>

        <div class="control-group">
          <label>Weight</label>
          <select :value="fontWeight" @change="$emit('update:fontWeight', Number($event.target.value))" class="weight-select">
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi-Bold</option>
            <option value="700">Bold</option>
          </select>
        </div>

        <div class="control-group">
          <label>Line Height: {{ lineHeight }}</label>
          <input 
            type="range" 
            :value="lineHeight" 
            @input="$emit('update:lineHeight', Number($event.target.value))" 
            min="1" 
            max="2" 
            step="0.1" 
            class="range-slider"
          />
        </div>

        <div class="control-group">
          <label>Letter Spacing: {{ letterSpacing }}px</label>
          <input 
            type="range" 
            :value="letterSpacing" 
            @input="$emit('update:letterSpacing', Number($event.target.value))" 
            min="-2" 
            max="5" 
            step="0.1" 
            class="range-slider"
          />
        </div>

        <div class="control-group color-group">
          <label>Text Color</label>
          <input 
            type="color" 
            :value="textColor" 
            @input="$emit('update:textColor', $event.target.value)" 
            class="color-picker"
          />
        </div>

        <div class="control-group color-group">
          <label>Background</label>
          <input 
            type="color" 
            :value="bgColor" 
            @input="$emit('update:bgColor', $event.target.value)" 
            class="color-picker"
          />
        </div>
      </div>


    </div>

    <!-- Right Side - Sample Text -->
    <div class="controls-right">
      <div class="sample-text-section">
        <label>Sample Text</label>
        <input 
          type="text" 
          :value="sampleText" 
          @input="$emit('update:sampleText', $event.target.value)" 
          placeholder="Type something to preview..."
          class="sample-input-large"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  'search', 'selectedTag', 'selectedScript', 'selectedWeight', 'sampleText',
  'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'textColor', 'bgColor', 'fontTokens', 'styleJSON',
  'favorites', 'comparisonFonts', 'exportStyleDictionary'
])

const emit = defineEmits([
  'update:search', 'update:selectedTag', 'update:selectedScript', 'update:selectedWeight', 'update:sampleText',
  'update:fontSize', 'update:fontWeight', 'update:lineHeight', 'update:letterSpacing',
  'update:textColor', 'update:bgColor', 'update:fontTokens'
])

const exportStyleDictionary = () => {
  if (props.exportStyleDictionary) {
    props.exportStyleDictionary()
  }
}

function copyToClipboard() {
  if (navigator.clipboard && window.getSelection) {
    const styleJSON = document.querySelector('.json-code')?.textContent
    if (styleJSON) {
      navigator.clipboard.writeText(styleJSON).then(() => {
        console.log('JSON copied to clipboard')
      })
    }
  }
}

function fillFromFavorites() {
  if (props.favorites.length >= 2) {
    const newTokens = {
      heading: props.favorites[0].name,
      body: props.favorites[1].name,
      ui: props.favorites.length >= 3 ? props.favorites[2].name : ''
    }
    emit('update:fontTokens', newTokens)
  }
}

function fillFromComparison() {
  if (props.comparisonFonts.length >= 2) {
    const newTokens = {
      heading: props.comparisonFonts[0].name,
      body: props.comparisonFonts[1].name,
      ui: props.comparisonFonts.length >= 3 ? props.comparisonFonts[2].name : ''
    }
    emit('update:fontTokens', newTokens)
  }
}

function clearSelection() {
  const newTokens = {
    heading: '',
    body: '',
    ui: ''
  }
  emit('update:fontTokens', newTokens)
}

function updateFontToken(role, value) {
  const newTokens = {
    ...props.fontTokens,
    [role]: value
  }
  emit('update:fontTokens', newTokens)
}
</script>