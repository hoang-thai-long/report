<template>
    <div>
        <multiselect 
        :track-by="trackBy"
        :label="label" 
        v-model="value" 
        :options="data"
        :placeholder="placeholder"
        ></multiselect>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
export default {
    // OR register locally
    components: { Multiselect },
    props:{
        data:null,
        trackBy:null,
        label:null,
        placeholder:null
    },
    data () {
      return {
        value: null,
      }
    },
    watch:{
        "value":function(o,v){
            console.log(o,v);
            this.$emit('change-value', o);
        }
    },
    methods:{
        
    }
  }
</script>