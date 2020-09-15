<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card v-for="post in posts" :key="post.id" class="card-post q-mb-md" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">UserName</q-item-label>
              <q-item-label caption>{{post.location}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-img :src="post.imageUrl"></q-img>
          <q-card>
            <q-card-section>
              <div>{{post.caption}}</div>
              <div class="text-caption text-grey">{{post.date | ToDate}}</div>
            </q-card-section>

            <q-card-section class="q-pt-none"></q-card-section>
          </q-card>
        </q-card>
      </div>
      <div class="col-4 only-pc">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="50px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">UserName</q-item-label>
            <q-item-label caption>Danny</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";

export default {
  name: "PageHome",
  data() {
    return {
      posts: [
        {
          id: "1",
          caption: "golden bridge",
          date: 1600193189746,
          location: "India",
          imageUrl: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
        {
          id: "2",
          caption: "golden bridge",
          date: 1600193189746,
          location: "India",
          imageUrl: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
        {
          id: "3",
          caption: "golden bridge",
          date: 1600193189746,
          location: "India",
          imageUrl: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
        {
          id: "4",
          caption: "golden bridge",
          date: 1600193189746,
          location: "India",
          imageUrl: "https://cdn.quasar.dev/img/boy-avatar.png",
        },
      ],
    };
  },
  filters: {
    ToDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    },
  },
};
</script>
<style>
.q-img {
  min-height: 60vhx;
}
</style>
