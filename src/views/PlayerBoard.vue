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
            <span @click="resource.cubes = splitResourceByDistribution(resource, distributionPercentage[0], distributionPercentage[1])">{{ resource.type }}</span>
            <div v-if="resource.cubes" class="flex w-16 my-1 justify-evenly">
              <div v-if="resource.cubes[0] >= 1" class="flex content-center justify-center w-4 h-4 text-xs leading-1 bg-amber-400">{{ resource.cubes[0] }}</div>
              <div v-if="resource.cubes[1] >= 1" class="flex content-center justify-center w-4 h-4 text-xs leading-1 bg-slate-400">{{ resource.cubes[1] }}</div>
              <div v-if="resource.cubes[2] >= 1" class="flex content-center justify-center w-4 h-4 text-xs bg-orange-600 leading-1">{{ resource.cubes[2] }}</div>
            </div>
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
  cubes: number[]
}

const terraformRating = ref(20);
const generation = ref(0)
const distributionPercentage = ref([90, 10])

const resources = ref<Resource[]>([
  {
    type: 'credits',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
  {
    type: 'steel',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
  {
    type: 'titanium',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
  {
    type: 'plants',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
  {
    type: 'energy',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
  {
    type: 'heat',
    amount: 0,
    production: 0,
    cubes: [0, 0, 0]
  },
]);


function splitResourceByDistribution(resource: Resource, percentage10s: number, percentage5s: number) : number[] {
  const number = resource.amount

  // Calculate the counts based on percentages
  const tens = Math.floor((number / 10) * percentage10s / 100);
  const fives = Math.floor((number / 5) * percentage5s / 100);
  const ones = number - tens * 10 - fives * 5;

  // Return the counts as an array
  const distributions = [
    tens ? tens : 0,
    fives ? fives : 0,
    ones ? ones : 0
  ]

  console.log(resource.type, distributions,  distributions[0]*10 + distributions[1]*5 + distributions[2]);
  return distributions
}

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

    // recalculate resource cubes
    resource.cubes = splitResourceByDistribution(resource, distributionPercentage.value[0], distributionPercentage.value[1])
  }

  generation.value += 1
}

</script>
