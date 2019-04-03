<template lang="html">
  <div>
    <table class="table">
      <TableHeader :displayFields="display_fields" @sort="sort_list" />
      <tbody>
        <tr v-for="(ce, key) in ceList" :key="key">
          <td v-for="(value, field) in display_fields" :key="field">
              <span v-if="typeof ce[field] === 'string' && ce[field].indexOf('.png') !== -1">
                <img v-bind:src="require('../'+ce[field])" alt="">
              </span>
              <span v-else>{{ce[field]}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableHeader from '../components/TableHeader.vue';
import ce from '../assets/craftEssence.json';
import servantStat from '../assets/servantStat.json';

export default {
  name: 'CraftEssenceList',
  components: {
    TableHeader,
  },
  data() {
    return {
      ceList: [],
      display_fields: {
        collectionNo: 'ID',
        rarity: 'Rarity',
        image: 'Image',
        name: 'Name',
        cost: 'Cost',
        hpBase: 'Base HP',
        atkBase: 'Base Attack',
        hpMax: 'Max HP',
        atkMax: 'Max Attack',
      },
      sort: {
        field: 'collectionNo',
        direction: 1, // 1 for ascending, -1 for descending
      },
    };
  },
  created() {
    const displayKeys = Object.keys(this.display_fields);
    this.ceList = ce.map((ceObj) => {
      const stat = servantStat.find(obj => obj.svtId === ceObj.id);
      const tempObj = {};
      displayKeys.forEach((key) => {
        if (['rarity', 'hpBase', 'atkBase', 'hpMax', 'atkMax'].indexOf(key) !== -1) {
          tempObj[key] = stat[key];
        } else if (key === 'image') {
          tempObj[key] = `assets/images/faces/${ceObj.id}.png`;
        } else {
          tempObj[key] = ceObj[key];
        }
      });

      tempObj.collectionNo = parseInt(tempObj.collectionNo, 10);

      return tempObj;
    });
    this.sortCe();
  },
  methods: {
    sort_list(key) {
      if (key !== this.sort.field) {
        this.sort.field = key;
        this.sort.direction = 1;
      } else {
        this.sort.direction *= -1;
      }
      this.sortCe();
    },
    sortCe() {
      return this.ceList.sort((a, b) => {
        if (a[this.sort.field] < b[this.sort.field]) {
          return -1 * this.sort.direction;
        }

        if (a[this.sort.field] > b[this.sort.field]) {
          return 1 * this.sort.direction;
        }

        return 0;
      });
    },
  },
};
</script>

<style lang="css">
</style>
