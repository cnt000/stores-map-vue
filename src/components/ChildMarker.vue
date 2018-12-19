<!-- ChildMarker -->
<template><div></div></template>
<script>
export default {
  props: {
    google: Object,
    map: Object,
    position: Object
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow } = this.google.maps;
    let infowindow = new InfoWindow({
      content: this.position.markerName
    });
    let marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    marker.addListener("click", function() {
      infowindow.open(this.map, marker);
    });
  }
};
</script>
