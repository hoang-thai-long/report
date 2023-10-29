<template>
    <div>
        <date-picker @change="changeValue" v-model="time" range></date-picker>
    </div>
</template>
<script>
  import DatePicker from 'vue2-datepicker';  
  import 'vue2-datepicker/index.css';

  export default {
    components: { DatePicker },
    data(){
        return {
            start:null,
            end:null,
            time:null
        }
    },
    methods:{
        changeValue :function(){
            this.$emit('change-value', this.time);
        }
    }
  }

</script>