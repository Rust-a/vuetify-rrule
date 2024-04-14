<template>
  <v-app>
    <v-main>
      <v-sheet width="800">
        <v-card>
          <v-toolbar>Example</v-toolbar>
          <v-card-item>
            <rrule-component/>
          </v-card-item>
        </v-card>
      </v-sheet>



    </v-main>

    <app-footer />
  </v-app>
</template>

<script setup>
import RruleComponent from "@/components/rrule/RruleComponent.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>
