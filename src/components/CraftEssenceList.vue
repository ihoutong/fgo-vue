<template lang="html">
  <div>
    <table class="table">
      <thead>
        <tr>
          <th v-for="(value, key) in display_fields" v-on:click="sort_list(key)" class="pointer">{{value}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ce in ce_list">
          <td v-for="(value, field) in display_fields">
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
import ce from '../assets/craft_essence.json';
import servant_stat from '../assets/servant_stat.json';

export default {
  name: 'CraftEssenceList',
  data: function () {
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
        direction: 1  //1 for ascending, -1 for descending
      }
    }
  },
  created: function () {
    for (var i = 0; i < ce.length; i++){
      var stat = servant_stat.find(obj => {
        return obj.svtId == ce[i].id
      });

      //Update servant_stat too
      if (typeof stat === "undefined"){
        continue;
      }

      var temp_obj = {};
      for (let field_name in this.display_fields){
        if (['rarity', 'hpBase', 'atkBase', 'hpMax', 'atkMax'].indexOf(field_name) !== -1){
          temp_obj[field_name] = stat[field_name];
        }
        else if (field_name == 'image'){
          temp_obj[field_name] = 'assets/images/faces/'+ce[i].id+'.png';
        }
        else{
          temp_obj[field_name] = ce[i][field_name];
        }
      }

      temp_obj.collectionNo = parseInt(temp_obj.collectionNo);

      this.original_ce_list.push(temp_obj);
    }
  },
  computed: {
    ce_list: function (){
      return this.original_ce_list.sort((a,b) => {
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
    sort_list: function (key){
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

<style lang="css">
</style>
