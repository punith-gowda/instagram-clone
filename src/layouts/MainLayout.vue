<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white text-grey-10 " bordered>
      <q-toolbar class="only-pc-header constrain" >
        <q-btn flat round color="primary" icon="camera" size="20px" to="/camera" class="only-pc" />
        <q-toolbar-title class="text-grand-hotel text-bold only-pc-text">puniagram</q-toolbar-title>
        <q-btn
          flat
          round
          color="primary"
          icon="eva-home-outline"
          size="20px"
          to="/"
          class="only-pc q-mr-sm"
        />
        <q-separator vertical inset />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-grey-2" >
      <router-view />
    </q-page-container>
    <q-footer class="bg-white only-mobile" bordered>
      <q-tabs class="text-grey-10" active-color="primary" indicator-color="transparent">
        <q-route-tab to="/" icon="eva-home-outline" />
        <q-route-tab to="/camera" icon="camera" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
export default {};
</script>
<style>
.q-toolbar__title {
  font-size: 30px;
  letter-spacing: 1px;
}
.q-footer .q-tab__icon {
  font-size: 30px;
}
.q-footer {
  height: 50px;
}
</style>

