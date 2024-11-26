<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <img class="image" ref="img" :src="require('../assets/images/' + getImgIndex + '.jpg')" />
    </div>
    <div>
      <button class="button" @click="next()" :disabled="disable">Next</button>
    </div>
    <div v-for="pred in predictions" :key="pred.index">{{ pred.label }}: {{ pred.probability.toFixed(0) + '%' }}</div>
    <div v-if="!predictions.length">hmmm...</div>
  </div>
</template>

<script>
import * as tf from '@tensorflow/tfjs';
import * as cvstfjs from "customvision-tfjs";
import labels from "raw-loader!../../public/models/labels.txt";

tf.setBackend('webgl'); // or 'cpu'

export default {
  name: "DetectImage",
  props: {
    msg: String
  },
  data() {
    return {
      labels: labels,
      model: null,
      predictions: [],
      image: 0,
      numImages: 25
    };
  },
  computed: {
    getImgIndex() {
      return this.image.toString();
    },
    disable() {
      return this.image === this.numImages;
    }
  },
  async mounted() {
    await tf.ready(); // Ensure the backend is ready
    this.image++;
    this.model = new cvstfjs.ClassificationModel();
    try {
      await this.model.loadModelAsync("models/model.json");
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Error loading model:", error);
    }
    this.labels = labels.split("\n").map(e => e.trim());
    this.predict();
  },
  methods: {
    async predict() {
      const imgElement = this.$refs.img;
      if (!imgElement) {
        console.error('Image element not found');
        return;
      }
      try {
        const prediction = await this.model.executeAsync(imgElement);
        console.log('Prediction:', prediction);
        const label = prediction[0];
        this.predictions = label.map((p, i) => ({
          index: i,
          label: this.labels[i],
          probability: p * 100
        }));
      } catch (error) {
        console.error('Error during model execution:', error);
      }
    },
    next() {
      this.image++;
      this.predict();
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
.image {
  min-height: 500px;
  max-height: 500px;
  max-width: 100%;
}
.button {
  width: 200px;
  height: 50px;
  border-radius: 5px;
  background-color: blueviolet;
}
</style>