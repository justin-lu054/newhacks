/**
 * Singleton instance of tracker to be used by location tracking background task
 */
class LocationTaskTrackers {

    //implement singleton pattern
    static instance; 

    constructor() {
        //ensure only one instance exists at a time
        if (this.instance) {
            return this.instance; 
        }

        this.distanceTravelled = 0; 
        this.counter = 0; 
        this.locationHistory = []; 
        this.timeHistory = []; 
        this.timeElapsed = 0;
        this.addresscoords = {};
        this.warningShowed = false; 
        this.instance = this; 
    }

    addDistanceTravelled(distance) {
        this.distanceTravelled += distance; 
    }
    
    addTimeElapsed(time) {
        this.timeElapsed += time;
    }

    incrementCounter() {
        this.counter++; 
    }

    addTimeHistory(time) {
        this.timeHistory.push(time); 
    }

    popTimeHistory() {
        this.timeHistory.shift(); 
    }
    
    addLocationHistory(location) {
        this.locationHistory.push(location); 
    }

    popLocationHistory() {
        this.locationHistory.shift(); 
    }

    setWarningShowed() {
        this.warningShowed = true; 
    }

    setAddressCoords(addresscoords) {
        this.addresscoords = addresscoords; 
    }

    resetTrackers() {
        this.distanceTravelled = 0; 
        this.counter = 0; 
        this.locationHistory = []; 
        this.timeHistory = []; 
        this.timeElapsed = 0;
        this.warningShowed = false; 
    }
}

export default LocationTaskTrackers; 