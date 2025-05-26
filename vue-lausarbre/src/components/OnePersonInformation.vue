<template>
    <v-table dense>
        <tbody>
            <tr v-for="([feature, value], index) in featureValues" :key="index">
                <td>{{ feature }}</td>

                <td class="font-weight-medium">
                    <span v-if="Array.isArray(value)">
                        {{ value.join(', ') }}
                    </span>
                    <span v-else>
                        {{ value }}
                    </span>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>


<script setup lang="ts">
import { RAW_TO_PRETTY } from '@/core/constants';
import { getFeatureValuesForID, getStartEndYearsForID } from '@/core/feature_values';
import type { OnePersonInfoProps, RawElement } from '@/types';
import { computed } from "vue"

const props = defineProps<OnePersonInfoProps>()

const featureValues = computed(() => {

    const m = new Map<string, RawElement>()
    if (props.id == null)
        return m

    const values = getFeatureValuesForID(props.id)
    const features = Array.from(RAW_TO_PRETTY.values())

    features.forEach((feature, i) => m.set(feature, values[i]))

    const years = getStartEndYearsForID(props.id)
    if(years.length > 0){
        m.set("Retrouvé en", years[0])
        m.set("Jusqu'en", years[1])
    }
    return m

})

</script>