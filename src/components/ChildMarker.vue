<!-- ChildMarker -->
<template><div></div></template>
<script>
export default {
  props: {
    google: Object,
    map: Object,
    position: Object,
    markerName: String
  },
  mounted() {
    const { Marker } = this.google.maps;
    const { InfoWindow} = this.google.maps;
    var infowindow = new google.maps.InfoWindow({
      content: this.position.markerName
    });
    var marker = new Marker({
      position: this.position,
      map: this.map,
      title: this.position.markerName
    });
    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    })
  }
};
</script>
