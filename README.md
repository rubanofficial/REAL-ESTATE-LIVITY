1. MAP PICKER RENDERED:
   ├─ MapContainer center={[20.5937, 78.9629]} zoom={4}
   └─ Instruction: "Click the map to set location"

2. USER CLICKS ON MAP:
   ├─ LocationPicker component:
   │  └─ useMapEvent("click", (event) => {
   │       onPick(event.latlng.lat, event.latlng.lng)
   │     })
   │
   ├─ setForm({
   │    ...form,
   │    location: { lat: 13.0827, lng: 80.2707 }
   │  })
   │
   └─ Marker appears at clicked position

3. MARKER FEATURES:
   ├─ Custom SVG icon (house shape)
   ├─ Draggable: user can move marker
   ├─ eventHandlers.dragend:
   │  └─ Gets new position and updates form.location
   │
   └─ Display: "Selected: 13.08273, 80.27070"

4. FORM SUBMIT:
   ├─ location sent as JSON string in FormData
   ├─ Backend parses and validates { lat, lng }
   └─ Stored in Listing.location