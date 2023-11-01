<template>
    <div class="range" :style="'--p:'+dataValue">
        <div class="range__label"></div>
    </div>
</template>
<script>
export default{
    name:'progress-loading',
    props:{
        dataValue:null
    }
}
</script>
<style lang="scss">
.range {
  position: relative;
  background-color: #333;
  width: 100%;
  height: 15px;
  border-radius: 10px;
  font-family: 'Orbitron', monospace;
  
  &:before {
    --width: calc(var(--p) * 1%);
    
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: #F3E600;
    z-index: 0;
    animation: load .5s forwards linear, glitch 2s infinite linear;
  }
  
  &:after {
    counter-reset: progress var(--p);
    content: counter(progress) '%';
    color: #000;
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translateY(-50%) skewX(-30deg);
    z-index: 1;
    color: #fff;
  }
  
  &__label {
    transform: skew(-30deg) translateY(-100%);
    line-height: 1.5;
  }
}

@keyframes load {
  to {
    width: var(--width);
  }
}

@keyframes glitch {
  0%, 5% {
    transform: translate(0, 0);
  }
  1% {
    transform: translate(-5%, -10%);
  }
  2% {
    transform: translate(10%, 30%);
  }
  3%{
    transform: translate(-43%, 10%);
  }
  4% {
    transform: translate(2%, -23%);
  }
}
</style>