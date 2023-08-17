# spring-boot-starter-fbl-with-vue-day6
- typeScript + class based component
  [官網連結](https://class-component.vuejs.org/)

- class 寫法

  ```vue
  <script>
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import Card from '@/components/Card.vue';

  @Component({
    components: {
      Card
    }
  })
  export default class GreetingPage extends Vue {
    items: Array<any> = [
      {
        id: 0,
        name: "Apple",
        imageUrl: "https://picsum.photos/id/237/200/300",
      }
    ];

    currId: number = 0;
    currName: string = "";
    currImageUrl: string = "";

    onItemSubmit() {
      ...
    }

    onCardClick() {
      ...
    }
  }
  </script>
  ```


