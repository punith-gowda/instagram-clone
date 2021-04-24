<template>
  <q-page class="constrain q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post.id"
            class="card-post q-mb-md"
            flat
            bordered
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">Punith</q-item-label>
                <q-item-label caption>{{ post.location }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-img :src="post.imageURL"></q-img>
            <q-card>
              <q-card-section>
                <div>{{ post.caption }}</div>
                <div class="text-caption text-grey">
                  {{ post.date | ToDate }}
                </div>
              </q-card-section>

              <q-card-section class="q-pt-none"></q-card-section>
            </q-card> </q-card
        ></template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h4 class="text-center text-grey text-bold">No Posts Yet</h4>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton size="40px" type="QAvatar" animation="fade" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton
                type="text"
                width="50%"
                class="text-subtitle2"
                animation="fade"
              />
            </q-card-section> </q-card
        ></template>
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
            <q-item-label caption>punith</q-item-label>
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
      posts: [],
      loadingPosts: false,
    };
  },
  filters: {
    ToDate(value) {
      return date.formatDate(value, "MMMM D h:mmA");
    },
  },
  methods: {
    getposts() {
      this.loadingPosts = true;
      this.$axios
        .get(`${process.env.API}/posts`)
        .then((response) => {
          this.posts = response.data;
          this.loadingPosts = false;
        })
        .catch((err) => {
          this.loadingPosts = false;
        });
    },
  },
  created() {
    this.getposts();
  },
};
</script>
<style>
.q-img {
  min-height: 60vhx;
}
</style>
