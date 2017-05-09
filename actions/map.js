import constants from '../constants/map'
import { computeRegionRadiusInMeters } from '../utils/Region';
import { fetchNearbyStations } from './nearbyStations';

export function selectStation(station) {
    return {
        type: constants.STATION_CHANGE,
        payload: { station }
    }
}

export function mapRegionChange(region) {
    console.log('[Actions][Map][mapRegionChange] Region:', region);
    return {
        type: constants.MAP_REGION_CHANGE,
        payload: { region }
    }
}

export function updateMapRegion(region) {
    console.log('[Actions][Map][updateMapRegion] Region:', region);
    return async (dispatch, getState) => {
        dispatch(mapRegionChange(region));
        const distance = computeRegionRadiusInMeters(region);

        if (distance <= 100000) {
            console.log("[Actions][Map][updateMapRegion] Region radius (", distance, ") <= 100000 - Fetching stations inside perimeter:", { latitude: region.latitude, longitude: region.longitude });
            dispatch(fetchNearbyStations({ latitude: region.latitude, longitude: region.longitude }, 1000/*distance*/, undefined, 100));
        } else {
            console.log("[Actions][Map][updateMapRegion] Region radius (", distance, ") > 100000 - Do not fetch stations inside perimeter");
        }

    }
}

export function updateAnnotationType(annotationType) {
    return {
        type: constants.ANNOTATION_TYPE_CHANGE,
        payload: { annotationType }
    }
}
