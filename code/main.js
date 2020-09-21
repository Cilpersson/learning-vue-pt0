Vue.component("product-review", {
  template: `
  
    
    <form class="form-review" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s)</b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        this.$emit("review-submitted", productReview);

        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required");
        if (!this.review) this.errors.push("Review required");
        if (!this.rating) this.errors.push("Rating required");
      }
    },
  },
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
      <!--
        Just as mapping or forEaching over a list. items.map(item => {
        return item
        })
      -->
  <ul>
    <li v-for="detail in details">{{ detail }}</li>
  </ul>
  `,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">
        <div class="product-image">
          <!--
                v-bind: dynamically binds ant attribute (in this case src)
                to an expression (in this case) image. Think of "image" as {{ image }}
                v-bind:src="image" can just simply be written as :src="image"
             -->
          <img :src="image" />
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <!--
            For conditional rendering of a single component instead of using v-if
            v-show is most often a better option. v-show will toggle the visability of the
            component insted
          -->
          <p v-if="inStock">In stock</p>
          <p :class="{ 'product-text-OoS': !inStock}" v-else>Out of stock</p>
          <p>{{ sale }}</p>
          <p>Shipping: {{ shipping }}</p>

          <product-details :details="details"></product-details>
          <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ 'background-color': variant.variantColor }"
            @mouseover="updateProduct(index)"
          ></div>
          <!--
            v-on:click can be written as @click
            other modifiers are:
            @submit="" (when a form is submitted do something)
            @keyup.enter="" (when enter has been clicked do something)
          -->
          <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{ 'disabled-button': !inStock }"
          >
            Add to cart
          </button>
          <button
            @click="removeFromCart"
          >
           Remove item
          </button>

          <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet</p>
            <ul v-if="reviews.length !== []">
              <li v-for="(review, index) in reviews">
                <p>Name: {{ review.name }}</p>
                <p>Review: {{ review.review }}</p>
                <p>Rating: {{ review.rating }}</p>
              </li>
            </ul>
          </div>

          <product-review @review-submitted="addReview" ></product-review>
         
        </div>
      </div>
  `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      selectedVariant: 0,
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage:
            "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage:
            "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
          variantQuantity: 10,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    },
  },
  computed: {
    title() {
      return `${this.brand} ${this.product}`;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return `${this.brand} ${this.product} are on sale!`;
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
  },
});

const app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (let i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    },
  },
});
