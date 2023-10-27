<template>
  <div class="px-8 py-4 m-auto max-w-7xl">
    <div class="mb-4">
      <div class="flex flex-row justify-center text-slate-100">
        <label>Gen: </label>
        <input class="w-8 ml-[5px] mr-[-15px] bg-transparent" min="0" type="number" v-model.number="(generation)">
      </div>
      <div class="flex flex-row justify-center text-slate-100">
        <label>TR: </label>
        <input class="w-8 ml-[5px] mr-[-15px] bg-transparent" min="0" type="number" v-model.number="(terraformRating)">
      </div>
    </div>
    <div class="grid grid-cols-3 grid-rows-2 bg-opacity-50 max-w-auto bg-slate-700">
      <div class="flex flex-row justify-between border border-slate-500 max-w-10 text-slate-50" v-for="resource in resources" :key="resource.type">
        <div class="px-1 py-1 cursor-pointer select-none bg-red-600/25 sm:px-4 sm:py-6 md:px-10 md:py-7 hover:bg-red-600/100" @click="updateProduction(resource.type, false)">-</div>
        <div class="flex flex-col items-center justify-center">
          <div class="flex flex-col items-center">
            <span>{{ resource.type }}</span>
            <input class="block w-8 mr-[-15px] text-center bg-transparent" min="0" type="number" v-model.number="(resource.amount)">
          </div>
          <div>
            <input class="block w-8 mr-[-15px] text-center bg-transparent" :min="resource.type === 'credits' ? -5 : 0" type="number" v-model.number="(resource.production)">
          </div>
        </div>
        <div class="px-1 py-1 cursor-pointer select-none bg-green-600/25 sm:px-4 sm:py-6 md:px-10 md:py-7 hover:bg-green-600/100" @click="updateProduction(resource.type, true)">+</div>
      </div>
    </div>
    <button @click="generate()" class="px-4 py-2 mt-4 font-semibold bg-transparent border rounded text-slate-100 border-slate-100 hover:bg-slate-100 hover:text-black hover:border-transparent">
      Generate
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Resource {
  type: string,
  amount: number,
  production: number,
}

const terraformRating = ref(20);
const generation = ref(0)

const resources = ref<Resource[]>([
  {
    type: 'credits',
    amount: 0,
    production: 0,
  },
  {
    type: 'steel',
    amount: 0,
    production: 0,
  },
  {
    type: 'titanium',
    amount: 0,
    production: 0,
  },
  {
    type: 'plants',
    amount: 0,
    production: 0,
  },
  {
    type: 'energy',
    amount: 0,
    production: 0,
  },
  {
    type: 'heat',
    amount: 0,
    production: 0,
  },
]);

function updateProduction(resourceType: string, increase: boolean): void {
  const resourceToUpdate = resources.value.find(resource => resource.type === resourceType)
  if (!resourceToUpdate) return
  if (increase) {
    resourceToUpdate.production += 1;
  } else if (resourceToUpdate.production > (resourceToUpdate.type === 'credits' ? -5 : 0)) {
    resourceToUpdate.production -= 1;
  }
}

function generate(): void {
  // convert energy to heat
  const energyResource = resources.value.find(resource => resource.type === 'energy')
  const heatResource = resources.value.find(resource => resource.type === 'heat')
  if (energyResource && heatResource) {
    heatResource.amount += energyResource.amount
    energyResource.amount = 0
  }

  // increase resource by production
  for (const resource of resources.value) {
    if (resource.type === "credits") resource.amount += terraformRating.value
    resource.amount += resource.production
  }

  generation.value += 1
}

</script>
