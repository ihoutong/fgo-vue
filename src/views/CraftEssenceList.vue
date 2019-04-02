<template lang="html">
  <div>
    <table class="table">
      <TableHeader :displayFields="display_fields" @sort="sort_list" />
      <tbody>
        <tr v-for="(ce, key) in ce_list" :key="key">
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
      original_ce_list: [],
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
    for (let i = 0; i < ce.length; i += 1) {
      const stat = servantStat.find(obj => obj.svtId === ce[i].id);

      // Update servantStat too
      if (typeof stat === 'undefined') {
        // eslint-disable-next-line
        continue;
      }

      const tempObj = {};
      Object.keys(this.display_fields).forEach((key) => {
        if (['rarity', 'hpBase', 'atkBase', 'hpMax', 'atkMax'].indexOf(key) !== -1) {
          tempObj[key] = stat[key];
        } else if (key === 'image') {
          tempObj[key] = `assets/images/faces/${ce[i].id}.png`;
        } else {
          tempObj[key] = ce[i][key];
        }
      });

      tempObj.collectionNo = parseInt(tempObj.collectionNo, 10);

      this.original_ce_list.push(tempObj);
    }
  },
  computed: {
    ce_list() {
      return this.original_ce_list.slice().sort((a, b) => {
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
  methods: {
    sort_list(key) {
      if (key !== this.sort.field) {
        this.sort.field = key;
        this.sort.direction = 1;
      } else {
        this.sort.direction *= -1;
      }
    },
  },
};
</script>

<style lang="css">
</style>
