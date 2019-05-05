<template>
  <div>
    <div class="filter-container">
      <div class="pointer" v-on:click="show_filters()">
        Filters &#709;
      </div>
      <div v-bind:class="{'d-none': hide_filters}">
        Card Distribution
        <div class="row">
          <CardOptions v-bind:display_name="'Number of Buster'" v-bind:values="cardoptions_values" v-model="buster"/>
          <CardOptions v-bind:display_name="'Number of Quick'" v-bind:values="cardoptions_values" v-model="quick"/>
          <CardOptions v-bind:display_name="'Number of Arts'" v-bind:values="cardoptions_values" v-model="arts"/>
          <CardOptions v-bind:display_name="'Np Type'" v-bind:values="np_options" v-model="npType" />
        </div>
      </div>
    </div>
    <table class="table">
      <TableHeader :displayFields="display_fields" @sort="sort_servants" />
      <tbody>
        <ServantRow v-for="servant in servants" :servant="servant" :key="servant['ID']"/>
      </tbody>
    </table>
  </div>
</template>

<script>
import classes from '../assets/class.json';
import servant from '../assets/servant.json';

import CardOptions from '../components/CardOptions.vue';
import TableHeader from '../components/TableHeader.vue';
import ServantRow from '../components/ServantRow.vue';

/*
#mstQuest.id === mstTreasureDevice[x].condQuestId
write(toJSON(data$mstQuest), "quests.json")

contains characters that were stripped and replaced. Figure out what those are before using them
#mstTreasureDeviceDetail.id === $mstTreasureDevice.id
write(toJSON(data$mstTreasureDeviceDetail), 'npDescrption.json')

#mstCombineLimit.id === mstSvt.id. ALSO, svtLimit === ascension level
write(toJSON(data$mstCombineLimit), 'ascensionMats.json');

#mstCombineSkill.id === mstSvt.id
write(toJSON(data$mstCombineSkill), 'skillMats.json');

#mstSvtExp.type === mstSvt.expType
#figure out how to use this later. For now, just keep this here
write(toJSON(data$mstSvtExp), 'expCurve.json');


#iconId === icon id ()SkillIcon_ICONID.png
mstSkill.id === mstSvtSill.skillId
write(toJSON(data$mstSkill), 'skills.json');

#mstSvtSkill.skillId === mstSkill.id
#num === skill position
write(toJSON(data$mstSvtSkill), 'skillsData.json');

#mstSkillDetail.id === mstSvtSkill.skillId
write(toJSON(data$mstSkillDetail), 'skillsDetail.json');

#there's also a skDetail that seems to be hardcoded...

#ignored
#master.mstSvtCommentAdd

#still need to find out the overcharge and stuff for NP
*/

// add class filter
export default {
  name: 'ServantList',
  components: {
    CardOptions,
    TableHeader,
    ServantRow,
  },
  data() {
    return {
      servants_original: [],
      cardoptions_values: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
      },
      np_options: {
        Any: 0,
        Buster: 2,
        Quick: 3,
        Arts: 1,
      },
      buster: 0,
      quick: 0,
      arts: 0,
      npType: 0,
      display_fields: {
        collectionNo: 'ID',
        rarity: 'Rarity',
        image: 'Image',
        name: 'Name',
        class: 'Class',
        cost: 'Cost',
        hpBase: 'Base HP',
        atkBase: 'Base Attack',
        hpMax: 'Max HP',
        atkMax: 'Max Attack',
        cardIds: 'Command Cards',
        npCard: 'NP',
      },
      hide_filters: true,
      sort: {
        field: 'collectionNo',
        direction: 1, // 1 for ascending, -1 for descending
      },
    };
  },
  created() {
    this.servants_original = servant.map((servantObj) => {
      const tempObj = Object.assign({}, servantObj);

      const classData = classes.find(obj => obj.id === servantObj.classId);

      let np = servantObj.noblePhantasms[0];
      if (np === undefined) {
        np = {
          cardId: 1,
        };
      }

      tempObj.class = `assets/images/class/class_${classData.iconImageId}_${tempObj.stats[0].rarity}.png`;
      tempObj.npCard = np.cardId;

      tempObj.card_count = tempObj.cardIds.reduce((accumulator, current) => {
        accumulator[current] += 1;
        return accumulator;
      }, { 1: 0, 2: 0, 3: 0 });

      return tempObj;
    });
  },
  computed: {
    servants() {
      const filteredServants = this.servants_original.filter((obj) => {
        if (this.arts > 0 && this.arts !== obj.card_count[1]) {
          return false;
        }

        if (this.buster > 0 && this.buster !== obj.card_count[2]) {
          return false;
        }

        if (this.quick > 0 && this.quick !== obj.card_count[3]) {
          return false;
        }

        return (this.npType === 0 || this.npType === obj.npCard);
      });

      return filteredServants.sort((a, b) => {
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
    show_filters() {
      this.hide_filters = !this.hide_filters;
    },
    sort_servants(key) {
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

<style lang="scss">
img {
  width: 62px;
  height: auto;
}
.filter-container {
  padding-bottom: 10px;
}
</style>
