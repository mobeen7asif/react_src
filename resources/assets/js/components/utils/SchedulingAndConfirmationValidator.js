export default class SchedulingAndConfirmationValidator {
    validate(campaignSchedulerType, schedule, selectedCampaign) {
        if (campaignSchedulerType === 'run_now' || campaignSchedulerType === 'permanent')
            return true;
        else {
            if (selectedCampaign === 'Dynamic') {
                return this.finalizeDynamicCampaign(schedule);
            } else {
                return this.finalizeProximityAndSetAndForgetCampaigns(schedule);
            }
        }//..... end of if-else() ....//
    }//.... end of validate() .....//

    finalizeDynamicCampaign(schedule) {
        return !!(schedule.from_date);
    }//..... end of finalizeDynamicCampaign() .....//

    finalizeProximityAndSetAndForgetCampaigns(schedule) {
        return (schedule.isCapCampaign)
            ? !!(schedule.from_date && schedule.end_date && schedule.isCapCampaign && schedule.cap )
            : !!(schedule.from_date && schedule.end_date);
    }//..... end of finalizeProximityAndSetAndForgetCampaigns() .....//
}//..... end of class.