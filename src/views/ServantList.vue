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
          <CardOptions v-bind:display_name="'Np Type'" v-bind:values="np_options" v-model="np_type" />
        </div>
      </div>
    </div>
    <table class="table">
      <TableHeader :displayFields="display_fields" @sort="sort_servants" />
      <tbody>
        <tr v-for="servant in servants" :key="servant['ID']">
          <td v-for="(value, field) in display_fields" :key="field">
              <span v-if="typeof servant[field] === 'string' && servant[field].indexOf('.png') !== -1">
                <img v-bind:src="require('../'+servant[field])" alt="">
              </span>
              <span v-else-if="field === 'cardIds'">
                <img style="margin-right: -40px;" v-for="(card, key) in servant[field]" :key="key" :src="require(`../assets/images/cmdCard/${card}.png`)" alt="">
              </span>
              <span v-else>{{servant[field]}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import servant from '../assets/servant.json';
import servantNp from '../assets/servantNp.json';
import servantStat from '../assets/servantStat.json';
import classes from '../assets/class.json';
import CardOptions from '../components/CardOptions.vue';
import TableHeader from '../components/TableHeader.vue';

/*
write(toJSON(old_servants), "servants.bak.json");
write(toJSON(valid_servants), "servant.json");
write(toJSON(data$mstSvtLimit), "servantStat.json")
#contains servant id, damage distribtuion, rankup/interlude
write(toJSON(data$mstSvtTreasureDevice), "servantNp.json")

# contains the np name and rank this id === treasureDeviceId from above
# typeText = ranking
write(toJSON(data$mstTreasureDevice), "servantNpName.json")

#mstQuest.id === mstTreasureDevice[x].condQuestId
write(toJSON(data$mstQuest), "quests.json")

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
      np_type: 0,
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
        np: 'NP',
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
      const tempObj = {};

      // For now just pull the cardid. In the future, pull the damage distribution too.
      // Maybe even the strengthening availability
      let np = servantNp.find(obj => obj.num === 1 && obj.svtId === servantObj.id);
      const stat = servantStat.find(obj => obj.svtId === servantObj.id);
      const classData = classes.find(obj => obj.id === servantObj.classId);

      if (np === undefined) {
        np = {
          cardId: 1,
        };
      }

      // np name
      // var np_name = master.mstTreasureDevice.find(obj => {
      //   return obj.id == np.treasureDeviceId
      // });

      // for (var x = 0; x < this.display_fields.length; x++){
      //   var field_name = this.display_fields[x];

      Object.keys(this.display_fields).forEach((key) => {
        if (['rarity', 'hpBase', 'atkBase', 'hpMax', 'atkMax'].indexOf(key) !== -1) {
          tempObj[key] = stat[key];
        } else if (key === 'np') {
          tempObj[key] = `assets/images/cmdCard/${np.cardId}.png`;
        } else if (key === 'class') {
          tempObj[key] = `assets/images/class/class_${classData.iconImageId}_${tempObj.rarity}.png`;
        } else if (key === 'image') {
          tempObj[key] = `assets/images/faces/${servantObj.id}0.png`;
        } else {
          tempObj[key] = servantObj[key];
        }
      });
      tempObj.collectionNo = parseInt(tempObj.collectionNo, 10);
      tempObj.np_card = np.cardId;
      tempObj.card_count = {
        1: 0,
        2: 0,
        3: 0,
      };

      // tempObj.np_name = np_name.ruby;
      for (let x = 0; x < tempObj.cardIds.length; x += 1) {
        tempObj.card_count[tempObj.cardIds[x]] += 1;
      }

      return tempObj;
    });

    this.servants_original.sort((a, b) => {
      if (a.collectionNo < b.collectionNo) {
        return -1;
      }

      if (a.collectionNo > b.collectionNo) {
        return 1;
      }
      return 0;
    });
  },
  computed: {
    servants() {
      const cardsSelected = {
        1: this.arts,
        2: this.buster,
        3: this.quick,
      };

      const filteredServants = this.servants_original.filter((obj) => {
        for (let x in cardsSelected) {
          if (cardsSelected[x] === 0) {
            continue;
          }

          if (obj.card_count[x] !== cardsSelected[x]) {
            return false;
          }
        }

        return (this.np_type === 0 || this.np_type === obj.np_card);
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
