export const createVehiclePayload = (
  response: any,
  registrationNo: string,
  token: any,
) => {
  const data = response?.data;

  return {
    vendorid: token?.vendorid || '',
    vehicleid: '',
    vehicleDetails: {
      registrationNo: registrationNo,
      registrationDate: data?.registration_date || '',
      registeredAt: data?.registered_at || '',
      rcStatus: data?.rc_status || '',
      ownerName: data?.owner_name || '',
      fatherName: data?.father_name || '',
      presentAddress: data?.present_address || '',
      permanentAddress: data?.permanent_address || '',
      mobileNumber: data?.mobile_number || '',
      vehicleCategory: data?.vehicle_category || data?.vehiclecategory || '',
      vehicleCategoryDescription: data?.vehicle_category_description || '',
      vehicleManufacturer:
        data?.maker_description || data?.vehicle_manufacturer || '',
      makerModel: data?.maker_model || '',
      bodyType: data?.body_type || '',
      fuelType: data?.fuel_type || '',
      manufacturingDate: data?.manufacturing_date || '',
      chassisNumber: data?.vehicle_chasi_number || data?.chassis_number || '',
      engineNumber: data?.vehicle_engine_number || data?.engine_number || '',
      cubicCapacity: data?.cubic_capacity || 0,
      vehicleGrossWeight: data?.vehicle_gross_weight || 0,
      unladenWeight: data?.unladen_weight || 0,
      noCylinders: data?.no_cylinders || 0,
      seatCapacity: data?.seat_capacity || 0,
      fitUpto: data?.fit_up_to || data?.fit_upto || '',
      insuranceUpto: data?.insurance_upto || '',
      taxUpto: data?.tax_upto || '',
      taxPaidUpto: data?.tax_paid_upto || '',
      puccNumber: data?.pucc_number || '',
      puccUpto: data?.pucc_upto || '',
      permitNumber: data?.permit_number || '',
      permitType: data?.permit_type || '',
      permitValidFrom: data?.permit_valid_from || '',
      permitValidUpto: data?.permit_valid_upto || '',
    },
    VehicleTypesDetails: {
      vehicleCategory: data?.vehicle_category_description || '',
      vehicleType: data?.vehicle_category || data?.vehiclecategory || '',
      emptyVehicleWeight: parseFloat(data?.unladen_weight) || 0,
      loadingCapacityGVW: parseFloat(data?.vehicle_gross_weight) || 0,
      loadingCapacityCubic: data?.cubic_capacity || '',
      topRemovable: false,
    },
    vehiclePhotos: {
      photo_url: '',
    },
  };
};
