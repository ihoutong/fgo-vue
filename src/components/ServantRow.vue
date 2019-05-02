<template>
<tr>
  <td>{{servant.collectionNo}}</td>
  <td>{{servant.stats[0].rarity}}</td>
  <td><img :src="require(`../assets/images/faces/${servant.id}0.png`)"/></td>
  <td>{{servant.name}}</td>
  <td><img :src="require('../'+servant.class)" /></td>
  <td>{{servant.cost}}</td>
  <td>{{servant.stats[0].hpBase}}</td>
  <td>{{servant.stats[0].atkBase}}</td>
  <td>{{servant.stats[0].hpMax}}</td>
  <td>{{servant.stats[0].atkMax}}</td>
  <td>
    <span v-if="isMobile()">
      <CommandCardMobile v-for="(card, key) in servant.cardIds" :key="key" :command="card" />
    </span>
    <span v-else>
      <CommandCard v-for="(card, key) in servant.cardIds" :key="key" :command="card" />
    </span>
  </td>
  <td>
    <CommandCardMobile v-if="isMobile()" :command="servant.npCard" />
    <CommandCard v-else :command="servant.npCard" />
  </td>
</tr>
</template>

<script>
import CommandCard from './CommandCard.vue';
import CommandCardMobile from './CommandCardMobile.vue';
import isMobile from '../helpers/isMobile.ts';

export default {
  name: 'ServantRow',
  components: {
    CommandCard,
    CommandCardMobile,
  },
  props: ['servant'],
  mixins: [isMobile],
};
</script>
