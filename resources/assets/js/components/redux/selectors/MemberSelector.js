export const selectSegmentBuilderMembersList = (segment) => {
    return segment.segment_users && segment.segment_users.data ? segment.segment_users.data : [];
};