<template>
<tr>
  <td>{{servant.collectionNo}}</td>
  <td>{{servant.rarity}}</td>
  <td><img :src="require('../'+servant.image)"/></td>
  <td>{{servant.name}}</td>
  <td><img :src="require('../'+servant.class)" /></td>
  <td>{{servant.cost}}</td>
  <td>{{servant.hpBase}}</td>
  <td>{{servant.atkBase}}</td>
  <td>{{servant.hpMax}}</td>
  <td>{{servant.atkMax}}</td>
  <td>
    <img style="margin-right: -40px;" v-for="(card, key) in servant.cardIds" :key="key" :src="require(`../assets/images/cmdCard/${card}.png`)" alt="">
  </td>
  <td>
    <img class="d-block" :src="require('../'+servant.npCard)" />

    <span class="d-block">{{servant.npStat.name}}</span>
    <span class="d-block">{{servant.npStat.ruby}}</span>
    <span class="d-block">Rank: {{servant.npStat.rank}}</span>
    <span class="d-block">{{servant.npStat.typeText}}</span>
  </td>
</tr>
</template>

<script>
export default {
  name: 'ServantRow',
  props: ['servant'],
};
</script>
