<template>
  <div class="overlay">
    <div class="dialog">
      <div class="dialog-text">Apakah Anda Yakin?</div>
      <div class="dialog-actions">
        <button class="cancel" @click="$emit('cancel')">Cancel</button>
        <button class="delete" @click="$emit('delete')">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
@import url('~/assets/css/main.css');
.overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(100, 100, 100, .5);
}
.dialog {
  padding: 16px;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: -50% -50%;
}
.dialog-text {
  font-size: 24px;
}
button {
  width: 200px;
  height: 50px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: .2s;
}
.cancel {
  background-color: #fafafa;
  border: 2px solid black;

  &:hover {
    background-color: #e0e0e0;
  }
}
</style>