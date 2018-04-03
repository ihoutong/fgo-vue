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
          <th v-for="(value, key) in display_fields" v-on:click="sort_servants(key)" class="pointer">{{value}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="servant in servants">
          <td v-for="(value, field) in display_fields">
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
  name: 'ServantList',
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
        np: 'NP'
      },
      hide_filters: true,
      sort: {
        field: 'collectionNo',
        direction: 1  //1 for ascending, -1 for descending
      }
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

      //np name
      // var np_name = master.mstTreasureDevice.find(obj => {
      //   return obj.id == np.treasureDeviceId
      // });

      // for (var x = 0; x < this.display_fields.length; x++){
      //   var field_name = this.display_fields[x];
      for (let field_name in this.display_fields){
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
          temp_obj[field_name] = servant[i][field_name];
        }
      }
      temp_obj.collectionNo = parseInt(temp_obj.collectionNo);
      temp_obj.np_card = np.cardId;
      temp_obj.card_count = {
        1: 0,
        2: 0,
        3: 0
      };

      //temp_obj.np_name = np_name.ruby;

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

      let filtered_servants = this.servants_original.filter(obj => {
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


      return filtered_servants.sort((a,b) => {
        if (a[this.sort.field] < b[this.sort.field]){
          return -1 * this.sort.direction;
        }
        else if (a[this.sort.field] > b[this.sort.field]){
          return 1 * this.sort.direction;
        }
        return 0;
      });
    }
  },
  methods: {
    show_filters: function (){
      this.hide_filters = !this.hide_filters;
    },
    sort_servants: function (key){
      if (typeof this.display_fields[key] === "undefined"){
        alert('ERROR: Invalid sort found');
        return;
      }

      if (key != this.sort.field){
        this.sort.field = key;
        this.sort.direction = 1;
      }
      else{
        this.sort.direction *= -1;
      }
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
