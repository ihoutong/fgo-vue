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
      <thead>
        <tr>
          <th>ID</th>
          <th>Rarity</th>
          <th>Image</th>
          <th>Name</th>
          <th>Class</th>
          <th>Cost</th>
          <th>Base HP</th>
          <th>Base Attack</th>
          <th>Max HP</th>
          <th>Max Attack</th>
          <th>Command Cards</th>
          <th>NP</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="servant in servants">
          <td v-for="field in display_fields">
              <span v-if="typeof servant[field] === 'string' && servant[field].indexOf('.png') !== -1">
                <img v-bind:src="require('../'+servant[field])" alt="">
              </span>
              <span v-else-if="field === 'cardIds'">
                <img style="margin-right: -40px;" v-for="card in servant[field]" v-bind:src="require('../assets/images/cmdCard/'+card+'.png')" alt="">
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
import servant_np from '../assets/servant_np.json';
import servant_stat from '../assets/servant_stat.json';
import classes from '../assets/class.json';
import CardOptions from './CardOptions.vue';

//add class filter
export default {
  name: 'HelloWorld',
  components: {
    CardOptions
  },
  data: function () {
    return {
      servants_original: [],
      cardoptions_values: {
        0:0,
        1:1,
        2:2,
        3:3
      },
      np_options: {
        Any: 0,
        Buster: 2,
        Quick: 3,
        Arts: 1
      },
      buster: 0,
      quick: 0,
      arts: 0,
      np_type: 0,
      display_fields: ['collectionNo', 'rarity', 'image', 'name', 'class', 'cost', 'hpBase', 'atkBase', 'hpMax', 'atkMax', 'cardIds', 'np'],
      hide_filters: true
    }
  },
  created: function (){
    for (var i = 0; i < servant.length; i++){
      var temp_obj = {};

      //For now just pull the cardid. In the future, pull the damage distribution too. Maybe even the strengthening availability
      var np = servant_np.find(obj => {
        return obj.num == 1 && obj.svtId == servant[i].id
      });

      var stat = servant_stat.find(obj => {
        return obj.svtId == servant[i].id
      });

      var class_data = classes.find(obj => {
        return obj.id == servant[i].classId;
      });

      for (var x = 0; x < this.display_fields.length; x++){
        var field_name = this.display_fields[x];
        if (['rarity', 'hpBase', 'atkBase', 'hpMax', 'atkMax'].indexOf(field_name) !== -1){
          temp_obj[field_name] = stat[field_name];
        }
        else if (field_name == 'np'){
          temp_obj[field_name] = 'assets/images/cmdCard/'+np.cardId+'.png'
        }
        else if (field_name == 'class'){
          temp_obj[field_name] = 'assets/images/class/class_'+class_data.iconImageId+'_'+temp_obj.rarity+'.png';
        }
        else if (field_name == 'image'){
          temp_obj[field_name] = 'assets/images/faces/'+servant[i].id+'0.png';
        }
        else{
          temp_obj[this.display_fields[x]] = servant[i][this.display_fields[x]];
        }
      }
      temp_obj.collectionNo = parseInt(temp_obj.collectionNo);
      temp_obj.np_card = np.cardId;
      temp_obj.card_count = {
        1: 0,
        2: 0,
        3: 0
      };
      for (let i = 0; i < temp_obj.cardIds.length; i++){
        temp_obj.card_count[temp_obj.cardIds[i]]++;
      }

      this.servants_original.push(temp_obj);
    }

    this.servants_original.sort((a, b) => {
      if (a.collectionNo < b.collectionNo){
        return -1;
      }
      else if (a.collectionNo > b.collectionNo){
        return 1;
      }
      return 0;
    });
  },
  computed: {
    servants: function (){
      var cards_selected = {
        1: this.arts,
        2: this.buster,
        3: this.quick
      };

      return this.servants_original.filter(obj => {
        for (let x in cards_selected){
          if (cards_selected[x] == 0){
            continue;
          }

          if (obj.card_count[x] != cards_selected[x]){
            return false;
          }
        }

        return (this.np_type == 0 || this.np_type == obj.np_card);
      });
    }
  },
  methods: {
    show_filters: function (){
      this.hide_filters = !this.hide_filters;
    }
  }
}
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
