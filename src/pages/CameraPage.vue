<template>
  <q-page class="q-pa-md constrain-more">
    <div class="camera-frame q-pa-md">
      <video v-show="!imageCaptured" ref="video" autoplay class="full-width" />
      <canvas
        v-show="imageCaptured"
        ref="canvas"
        class="full-width"
        height="240px"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        v-if="hasCamerasupport"
        v-show="camerabutton"
        @click="captureImg"
        round
        color="grey-10"
        icon="camera"
        size="md"
      />

      <q-file
        v-else
        outlined
        label="choose an Image"
        @input="captureImgFall"
        accept="image/*"
        v-model="imageUpload"
      >
        <template v-slot:prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>

      <div class="row justify-center q-col-gutter-lg">
        <q-input
          v-model="post.caption"
          label="caption"
          class="col-12 col-sm-6"
          dense
        />
        <q-input
          v-model="post.location"
          :loading="locloading"
          label="location"
          class="col-12 col-sm-6"
          dense
        >
          <template v-slot:append>
            <q-btn
              round
              dense
              v-if="!locloading && locSupport"
              flat
              icon="my_location"
              @click="getLocation"
            />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-ma-md">
        <q-btn
          unelevated
          rounded
          :disable="!post.caption || !post.photo"
          color="primary"
          @click="addPost()"
          label="Post now"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { uid } from "quasar";
import { date } from "quasar";
require("md-gum-polyfill");
export default {
  name: "CameraPage",
  data() {
    return {
      post: {
        id: uid(),
        caption: "",
        location: "",
        photo: null,
        date: Date.now(),
      },
      imageCaptured: false,
      imageUpload: [],
      hasCamerasupport: true,
      locloading: false,
      camerabutton: true,
    };
  },
  computed: {
    locSupport() {
      if ("geolocation" in navigator) return true;
      return false;
    },
  },
  methods: {
    initcamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          this.$refs.video.srcObject = stream;
        })
        .catch((error) => {
          this.hasCamerasupport = false;
        });
    },
    captureImg() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      canvas.width = video.getBoundingClientRect().width;
      canvas.height = video.getBoundingClientRect().height;
      let context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imageCaptured = true;
      this.post.photo = this.dataURItoBlob(canvas.toDataURL());
      this.disableCamera();
    },
    captureImgFall(file) {
      this.post.photo = file;
      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");
      var reader = new FileReader();
      reader.onload = (event) => {
        var img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          this.imageCaptured = true;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    disableCamera() {
      this.$refs.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.camerabutton = false;
    },
    dataURItoBlob(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    getLocation() {
      this.locloading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getCityAndCountry(position);
        },
        (err) => {
          locError();
        },
        { timeout: 7000 }
      );
    },
    getCityAndCountry(position) {
      let apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`;
      this.$axios
        .get(apiUrl)
        .then((result) => {
          this.locationaSuccess(result);
        })
        .catch((err) => {
          this.locError();
        });
    },
    locationaSuccess(result) {
      this.post.location = result.data.city;
      if (result.data.country) {
        this.post.location += `,${result.data.country}`;
      }
      this.locloading = false;
    },
    locError() {
      this.$q.dialog({
        dark: true,
        title: "Error",
        message: "Could not find your location",
      }),
        (this.locloading = false);
    },
    addPost() {
      this.$q.loading.show();
      let formdata = new FormData();
      formdata.append("id", this.post.id);
      formdata.append("caption", this.post.caption);
      formdata.append("location", this.post.location);
      formdata.append("date", this.post.date);
      formdata.append("file", this.post.photo, this.post.id + ".png");

      this.$axios
        .post(`${process.env.API}/createpost`, formdata)
        .then((Response) => {
          console.log(Response);
          this.$router.push("/");
          this.$q.notify({
            progress: true,
            message: "You Added a post.",
            color: "red",
            actions: [
              {
                label: "Dismiss",
                color: "yellow",
              },
            ],
          });
          this.$q.loading.hide();
        })

        .catch((err) => {
          this.$q.dialog({
            dark: true,
            title: "Error",
            message: "Something went Wrong please try again.",
          });
          this.$q.loading.hide();
        });
    },
  },
  mounted() {
    this.initcamera();
  },
  beforeDestroy() {
    if (this.hasCamerasupport) {
      this.disableCamera();
    }
  },
};
</script>
<style>
.camera-frame {
  border: 1px solid grey;
  border-radius: 10px;
}
</style>