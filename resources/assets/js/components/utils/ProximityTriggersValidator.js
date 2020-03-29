export default class ProximityTriggersValidator {
    validate(beaconsData, campaign) {
        return !!(beaconsData.selectedFloorPlan && beaconsData.selectedFloorPlanName && beaconsData.selectedFloorImageName
            && beaconsData.beacon_name && beaconsData.beacon_event && beaconsData.beacon_id &&
            parseInt(beaconsData.trigger_value_hour) >= 0 && parseInt(beaconsData.trigger_value_min) >= 0
            && campaign.trigger_type);
    }
}