import { useState, useEffect, useCallback, useRef } from 'react';
import { Main } from '../styled';
import { Form, Input, Button, message, Select, Row, Col, Spin, DatePicker, TimePicker, Switch, Table, Space, Tooltip } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';
import moment from 'moment';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { DataService } from '../../config/dataService/dataService';
import { editEventDetail, eventClientSideUrl, eventReportUrl, generateEventCode, getAllCustomers, getAllPaymentMethods, getAllVendors, getClientSideEvent, getEventReport, getMenu, getMenuWithPrices, getPriceByEventMasterId, kitchen_itineraryReportUrl, saveUpdatePayment } from '../../services/commonService';
import { Modal, Form as AntForm, Upload } from 'antd';
import { UploadOutlined, PlusOutlined, DatabaseOutlined, CloseCircleFilled } from '@ant-design/icons';
import UilEdit from '@iconscout/react-unicons/icons/uil-edit';

const { Option, OptGroup } = Select;

const formatDateForApi = (date) => (date ? date.toISOString() : null);
const formatTimeForApi = (time) => (time ? moment(time).format('HH:mm') : null);

const RUNNING_ORDER_FIELD_MAPPING = {
  2: ['txtGuestArrival', 'txtBrideGuestArrival',
    'txtGroomGuestArrival', 'txtBaratArrival', 'txtNikah', 'txtGroomEntrance',
    'txtBrideEntrance',
    'txtCouplesEntrance', 'txtDua', 'txtRingExchange', 'txtCakeCutting', 'txtRams', 'txtSpeeches', 'txtDance',
    'txtMeal', 'txtEndOfNight'],
  3: ['txtGuestArrival', 'txtBrideEntrance', 'txtGroomEntrance', 'txtDance', 'txtMeal', 'txtEndOfNight'],
  4: ['txtGuestArrival', 'txtBrideEntrance', 'txtMeal', 'txtEndOfNight'],
  5: ['txtGuestArrival', 'txtBrideEntrance', 'txtMeal', 'txtEndOfNight'],
};

const PaymentFormModal = ({
  visible,
  onCancel,
  onSubmit,
  activeEvent,
  arrPaymentMethods,
  loading = false,
}) => {
  const [form] = AntForm.useForm();
  const [fileList, setFileList] = useState([]);
  const [storedDocumentId, setStoredDocumentId] = useState(null);

  const handleFinish = (values) => {
    // Attach files to values
    const payload = {
      ...values,
      dtePaymentDate: values.dtePaymentDate ? values.dtePaymentDate.format('YYYY-MM-DD') : null,
    };
    if (activeEvent) {
      payload.serEventBudgetId = activeEvent?.serEventBudgetId
      payload.serEventPaymentId = activeEvent?.serEventPaymentId
      payload.serEventMasterId = activeEvent?.serEventMasterId
    }
    onSubmit(payload, fileList, storedDocumentId);
    form.resetFields();
    setFileList([]);
    setStoredDocumentId(null);
  };

  useEffect(() => {
    if (activeEvent && visible) {
      // Populate form fields for edit
      // Here, map your activeEvent fields to form fields as needed

      // Transform existing documents to Ant Design Upload fileList format
      if (activeEvent?.documents && activeEvent.documents.length) {
        const existingFiles = activeEvent.documents.map((doc, index) => ({
          uid: doc.serEventPaymentDocumentId || `existing-${index}`,
          name: doc.txtOriginalFileName || doc.txtDocumentName || `file-${index}`,
          status: 'done',
          url: doc.txtFilePath || '',
          // Keep original document data for reference
          isExisting: true,
          originalDoc: doc,
        }));
        setFileList(existingFiles);
        // Store the first document's ID for reuse when replacing
        if (activeEvent.documents[0]?.serEventPaymentDocumentId) {
          setStoredDocumentId(activeEvent.documents[0].serEventPaymentDocumentId);
        }
      }
      form.setFieldsValue({
        numAmount: activeEvent.numAmount || 0,
        txtRemarks: activeEvent.txtRemarks || '',
        txtPaymentMode: activeEvent.txtPaymentMode || undefined,
        dtePaymentDate: activeEvent.dtePaymentDate ? moment(activeEvent.dtePaymentDate, 'DD-MM-YYYY') : undefined,
        // Add other mappings as needed for your form fields
      });
      // Optionally, populate fileList or other states here
    }
  }, [activeEvent, visible]);


  const handleFileChange = ({ fileList: newFileList, file }) => {
    if (newFileList.length && newFileList[0]?.size > 3145728) {
      message.info('Maximum upload size exceeded!');
      return;
    }
    // If removing an existing file, preserve its document ID for replacement
    if (file.status === 'removed' && file.isExisting && file.originalDoc?.serEventPaymentDocumentId) {
      setStoredDocumentId(file.originalDoc.serEventPaymentDocumentId);
    }
    setFileList(newFileList);
  };

  return (
    <Modal
      open={visible}
      title="Add Payment Details"
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        setStoredDocumentId(null);
        onCancel();
      }}
      onOk={() => form.submit()}
      footer={[
        <Button key="cancel" onClick={() => {
          form.resetFields();
          setFileList([]);
          setStoredDocumentId(null);
          onCancel();
        }}>
          Cancel
        </Button>,
        <Button type="primary" key="submit" loading={loading} onClick={() => form.submit()}>
          Submit Payment
        </Button>
      ]}
      destroyOnClose
    >
      <AntForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <AntForm.Item
              name="numAmount"
              label="Amount"
              rules={[{ required: true, message: 'Please enter the payment amount' }]}
            >
              <Input type="number" placeholder="Enter amount" />
            </AntForm.Item>
          </Col>
          <Col span={12}>
            <AntForm.Item
              name="txtPaymentMode"
              label="Payment Mode"
              rules={[{ required: true, message: 'Please select payment mode' }]}
            >
              <Select placeholder="Select payment mode">
                {arrPaymentMethods.map(x =>
                (
                  <Option key={x.id} value={x.value}>{x.label}</Option>
                ))}
                {/* Add more as needed */}
              </Select>
            </AntForm.Item>
          </Col>
          <Col span={12}>
            <AntForm.Item
              name="dtePaymentDate"
              label="Payment Date"
              rules={[{ required: true, message: 'Please choose payment date' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </AntForm.Item>

          </Col>
          <Col span={12}>
            <AntForm.Item
              name="txtRemarks"
              label="Remarks"
              rules={[{ required: false }]}
            >
              <Input.TextArea rows={1} placeholder="Enter remarks (optional)" />
            </AntForm.Item>
          </Col>
        </Row>
        <AntForm.Item
          label="Attachment (Image)"
          disabled={fileList?.length}
        >
          <Upload
            beforeUpload={() => false}
            accept="image/*"
            fileList={fileList}
            onChange={handleFileChange}
            listType="picture"
            // disabled={fileList?.length}
            showUploadList={{
              showRemoveIcon: true,
              showPreviewIcon: true,
            }}
            maxCount={5}
          >
            {fileList?.length >= 5 ? null : (
              <Button disabled={!!fileList.length} icon={<UploadOutlined />}>Attach Image</Button>
            )}
          </Upload>
        </AntForm.Item>
      </AntForm>
    </Modal >
  );
};

const EventMasterForm = () => {
  const [form] = Form.useForm();
  const watchedDiscount = Form.useWatch('numDiscount', form);
  const lastFetchedGuestTableRef = useRef({ numGuests: null, numTables: null });
  const [loading, setLoading] = useState(false);
  const [loaderLabel, setLoaderLabel] = useState('');
  const [eventData, setEventData] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [decorPrice, setDecorPrice] = useState({});
  const [extraPrice, setExtraPrice] = useState(null);
  const [servicePrice, setServicePrice] = useState(null);
  const [decorPropertyPrice, setDecorPropertyPrice] = useState(null);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [arrPayment, setArrPayment] = useState([]);
  const [arrPaymentMethods, setArrPaymentMethods] = useState([]);
  const [activeFoodPrices, setActiveFoodPrices] = useState({}); // Track active prices from backend {categoryId: {price, subCategories: {subCategoryId: price}}}
  const [foodMenuSelections, setFoodMenuSelections] = useState({}); // Track current selections for reactive price calculation
  const [foodMenuLoading, setFoodMenuLoading] = useState(false); // local spinner for food menu re-fetch only
  const [foodMenuReady, setFoodMenuReady] = useState(false); // food menu hidden until both guest & table values are entered

  const [userImage, setUserImage] = useState([]);
  const [lookupData, setLookupData] = useState({
    eventTypes: [],
    venues: [],
    extras: [],
    services: [],
    decor: [],
    foodMenu: [],
    customers: [],
    vendors: [],
  });

  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  // Helper to get item price with default 0 if not present
  const getItemPrice = (item) => {
    return Number(item?.numCalculatedPrice) || Number(item?.numFinalPrice) || 0;
  };

  // Category IDs 4, 5, 6 are treated as a single pricing group.
  // Only the leader (4) shows the price input; 5 and 6 inherit its price.
  const GROUPED_CATEGORY_IDS = [4, 5, 6];
  const GROUP_PRICE_LEADER = 4;

  // Reusable helper: fetch menu with prices for given guest/table counts
  const fetchFoodMenu = useCallback(async (numGuests = 10, numTables = 10) => {
    const req = { numTables, numGuests };
    const menuResponse = await getMenuWithPrices(req);
    const dtoModifyPrice = {};
    let arrFoodMenu = [];
    if (menuResponse?.code == 200 && menuResponse?.result?.length) {
      arrFoodMenu = menuResponse.result.map(category => ({
        ...category,
        subCategories: (category.subCategories || []).map(subCat => {
          if (!dtoModifyPrice[category.categoryId]) dtoModifyPrice[category.categoryId] = {};
          dtoModifyPrice[category.categoryId][subCat.subCategoryId] = 0;
          const mergedItems = [
            ...(Array.isArray(subCat.items) ? subCat.items : []),
            ...(Array.isArray(subCat.compositeItems) ? subCat.compositeItems : []),
          ];
          return { ...subCat, items: mergedItems };
        }),
      }));
    }
    return { arrFoodMenu, dtoModifyPrice };
  }, []);

  // Calculate sum of selected food items' prices for a subcategory
  // Note: Not using lookupData.foodMenu in deps to avoid re-render loops
  const calculateFoodSubcategoryPrice = useCallback((categoryId, subCategoryId, selectedItemIds, foodMenuData) => {
    const menuData = foodMenuData || lookupData.foodMenu;
    const category = menuData.find(cat => cat.categoryId === categoryId);
    if (!category) return 0;

    const subCategory = category.subCategories.find(sub => sub.subCategoryId === subCategoryId);
    if (!subCategory) return 0;

    const items = subCategory.items || [];
    let total = 0;

    (selectedItemIds || []).forEach(itemId => {
      const item = items.find(i => (i.serMenuItemId === itemId || i.parentMenuItemId === itemId));
      if (item) {
        total += getItemPrice(item);
      }
    });

    return total;
  }, []);

  // Calculate total price for a category (sum of subcategory finals: user-entered price or items total)
  const calculateCategoryItemsTotal = useCallback((categoryId, foodMenuData) => {
    const menuData = foodMenuData || lookupData.foodMenu;
    const category = menuData.find(cat => cat.categoryId === categoryId);
    if (!category) return 0;

    let total = 0;
    (category.subCategories || []).forEach(subCat => {
      const userSubCatPrice = form.getFieldValue(['dtoFoodMenuPrices', String(categoryId), String(subCat.subCategoryId)]);
      if (userSubCatPrice !== undefined && userSubCatPrice !== '' && userSubCatPrice !== null) {
        total += Number(userSubCatPrice) || 0;
      } else {
        const selected = foodMenuSelections[categoryId]?.[subCat.subCategoryId] || [];
        total += calculateFoodSubcategoryPrice(categoryId, subCat.subCategoryId, selected, menuData);
      }
    });

    return total;
  }, [foodMenuSelections, calculateFoodSubcategoryPrice, form]);

  // Handler for food item selection change - updates selection and clears prices for reactive recalculation
  const handleFoodSelectionChange = useCallback((categoryId, subCategoryId, selectedItemIds) => {
    form.setFieldValue(['dtoFoodMenu', String(categoryId), String(subCategoryId)], selectedItemIds);
    // Clear subcategory price and category price whenever item selection changes
    form.setFieldValue(['dtoFoodMenuPrices', String(categoryId), String(subCategoryId)], '');
    form.setFieldValue(['dtoCategoryPrices', String(categoryId)], '');
    setFoodMenuSelections(prev => ({
      ...prev,
      [categoryId]: { ...(prev[categoryId] || {}), [subCategoryId]: selectedItemIds || [] }
    }));
  }, [form]);

  // Handler for manual subcategory price input change (this becomes numFinalPrice in payload)
  const handleFoodPriceChange = useCallback((categoryId, subCategoryId, value) => {
    // Simply set the user-entered price
    form.setFieldValue(['dtoFoodMenuPrices', String(categoryId), String(subCategoryId)], value);
  }, [form]);

  // Handler for manual category price input change (this becomes numFinalPrice in payload)
  const handleCategoryPriceChange = useCallback((categoryId, value) => {
    // Simply set the user-entered price
    form.setFieldValue(['dtoCategoryPrices', String(categoryId)], value);
  }, [form]);

  // Re-fetch food menu when numNumberOfGuests or numNumberOfTables changes
  const handleGuestTableChange = useCallback(async () => {
    const numGuests = form.getFieldValue('numNumberOfGuests');
    const numTables = form.getFieldValue('numNumberOfTables');
    // Both values required before calling API
    if (!numGuests || !numTables) return;

    // Skip re-fetch if values haven't changed since the last fetch
    // This prevents spurious re-fetches when focus moves to food item Select dropdowns
    // and triggers onBlur on the guest/table number inputs
    if (
      lastFetchedGuestTableRef.current.numGuests === Number(numGuests) &&
      lastFetchedGuestTableRef.current.numTables === Number(numTables)
    ) return;
    lastFetchedGuestTableRef.current = { numGuests: Number(numGuests), numTables: Number(numTables) };

    // Capture current food selections before re-fetch so we can restore valid ones
    const currentSelections = form.getFieldValue('dtoFoodMenu') || {};

    setFoodMenuLoading(true);
    const { arrFoodMenu } = await fetchFoodMenu(numGuests, numTables);
    setFoodMenuLoading(false);

    // Build set of all valid item IDs from the new menu
    const validItemIds = new Set();
    arrFoodMenu.forEach(cat => {
      (cat.subCategories || []).forEach(subCat => {
        (subCat.items || []).forEach(item => {
          if (item.serMenuItemId) validItemIds.add(item.serMenuItemId);
          if (item.parentMenuItemId) validItemIds.add(item.parentMenuItemId);
        });
      });
    });

    // Filter existing selections to only keep items still present in the new menu
    const filteredSelections = {};
    Object.keys(currentSelections).forEach(catId => {
      const catSel = currentSelections[catId] || {};
      Object.keys(catSel).forEach(subCatId => {
        const items = catSel[subCatId];
        const arr = Array.isArray(items) ? items : (items !== undefined && items !== null ? [items] : []);
        const validItems = arr.filter(id => validItemIds.has(id));
        if (validItems.length > 0) {
          if (!filteredSelections[catId]) filteredSelections[catId] = {};
          filteredSelections[catId][subCatId] = validItems;
        }
      });
    });

    setLookupData(prev => ({ ...prev, foodMenu: arrFoodMenu }));

    // Restore valid selections to form
    form.setFieldValue('dtoFoodMenu', filteredSelections);

    // Sync foodMenuSelections state for reactive price display
    const newFoodMenuSelections = {};
    Object.keys(filteredSelections).forEach(catId => {
      newFoodMenuSelections[Number(catId)] = {};
      Object.keys(filteredSelections[catId]).forEach(subCatId => {
        newFoodMenuSelections[Number(catId)][Number(subCatId)] = filteredSelections[catId][subCatId];
      });
    });
    setFoodMenuSelections(newFoodMenuSelections);

    // Food menu is now ready to show
    setFoodMenuReady(true);
  }, [fetchFoodMenu, form]);

  const labelModification = {
    'MainCourse': 'Main Course',
    'SaladAndCondiment': 'Salad And Condiment',
  };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes('view')) {
      setIsViewMode(true);
    } else {
      setIsViewMode(false);
    }

    console.log('serverfoodMenuSelections:', foodMenuSelections);


  }, [location.pathname, foodMenuSelections]);

  const accessToken = localStorage.getItem('access_token_admin');

  // Fetch Lookups (Events, Venues, Decor, Foods)
  const fetchLookupData = useCallback(async () => {
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // --- Event Types ---
      const eventTypesRes = await fetch(`${process.env.REACT_APP_API_URL}eventType/getAllActiveEventTypesWithSubEvents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const eventTypesJson = await eventTypesRes.json();
      let fetchedEventTypes = [];
      if (eventTypesJson.code === 200 && eventTypesJson.result) {
        eventTypesJson.result.forEach((mainEvent) => {
          if (mainEvent.subEvents) fetchedEventTypes = fetchedEventTypes.concat(mainEvent.subEvents);
        });
      }

      // --- Venues ---
      const venuesRes = await fetch(`${process.env.REACT_APP_API_URL}venueMaster/getAllActiveVenuesGroupedByActiveCities`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const venuesJson = await venuesRes.json();
      let fetchedVenues = [];
      if (venuesJson.code === 200 && venuesJson.result) {
        fetchedVenues = venuesJson.result; // keep city-grouped structure: [{ serCityId, txtCityName, venueMasters: [...] }]
      }

      // --- Decor ---
      const decorRes = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryMaster/getAllDecorMasterDataWithPrice`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const decorJson = await decorRes.json();
      let fetchedDecor = [];
      let dtoDecorPrices = {};
      let dtoDecorPropertyPrices = {};
      if (decorJson.code === 200 && decorJson.result) {
        fetchedDecor = decorJson.result;
        decorJson.result.forEach(x => {
          dtoDecorPrices[x.serDecorCategoryId] = x?.numPrice || 0

          x?.categoryProperties.forEach(j => {
            // For each category property, prepare the dtoDecorPropertyPrices object.
            // Structure: dtoDecorPropertyPrices[serDecorCategoryId][serPropertyId] = value (if exists, else 0)
            if (!dtoDecorPropertyPrices[x.serDecorCategoryId]) {
              dtoDecorPropertyPrices[x.serDecorCategoryId] = {};
            }
            // We assign price if exists, else 0.
            // Use j.serPropertyId as the property key.
            // If there is a price for this property (possibly at propValue.numPrice), assign it;
            // else assign 0.
            // If categoryProperties has numPrice field at property level, use it,
            // otherwise fall back to 0.
            let price = 0;
            if (j?.numPrice) {
              price = j.numPrice;
            }

            dtoDecorPropertyPrices[x.serDecorCategoryId][j.serPropertyId] = price;
          })
        });

        setDecorPrice(dtoDecorPrices);
        setDecorPropertyPrice(dtoDecorPropertyPrices);
      }

      // console.log('decorJson', decorJson);

      // --- Foods ---
      // const foodRes = await fetch(`${process.env.REACT_APP_API_URL}menuFoodMaster/getAllFoodsByType`, {
      //   method: 'POST',
      //   headers,
      //   body: JSON.stringify({}),
      // });
      // const foodJson = await foodRes.json();
      // let fetchedFood = [];
      // if (foodJson.code === 200 && foodJson.result) {
      //   Object.keys(foodJson.result).map((group) => {
      //     fetchedFood.push({ group, items: foodJson.result[group] });

      //   });
      // }


      let activeCusotmers = [];
      const data = await getAllCustomers();
      if (data.code === 200 && data.result && data.result?.length) {
        activeCusotmers = [...data.result];
      }

      let activeVendors = [];
      const resVendor = await getAllVendors();
      if (resVendor.code === 200 && resVendor.result && resVendor.result?.length) {
        activeVendors = [...resVendor.result];
      }

      const extrasRes = await fetch(`${process.env.REACT_APP_API_URL}decorExtras/getAllActiveData`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const extrasJson = await extrasRes.json();
      let fetchedExtras = [];
      if (extrasJson.code === 200 && extrasJson.result) {
        // console.log(extrasJson.result);
        fetchedExtras = extrasJson.result;
        const extrasSelections = extrasJson.result.reduce((acc, item) => {
          acc[item.serExtrasId] = item?.numPrice || 0;
          return acc;
        }, {});
        setExtraPrice(extrasSelections);


      }

      const servicesRes = await fetch(`${process.env.REACT_APP_API_URL}decorExtras/getAllActiveServicesData`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const servicesJson = await servicesRes.json();
      let fetchedServices = [];
      if (servicesJson.code === 200 && servicesJson.result) {
        fetchedServices = servicesJson.result;
        const servicesPrices = servicesJson.result.reduce((acc, item) => {
          acc[item.serExtrasId] = item?.numPrice || 0;
          return acc;
        }, {});
        setServicePrice(servicesPrices);
      }

      setLookupData(prev => ({
        ...prev,
        eventTypes: fetchedEventTypes,
        venues: fetchedVenues,
        extras: fetchedExtras,
        services: fetchedServices,
        decor: fetchedDecor,
        // food: fetchedFood,
        // foodMenu intentionally omitted — managed separately by getMenuWithPrices
        customers: activeCusotmers,
        vendors: activeVendors,
      }));

    } catch (err) {
      console.error('Lookup fetch error:', err);
      message.error('Failed to load lookup data.');
    } finally {
      setLoading(false);
    }
  }, [fetchFoodMenu]);

  // Load event data from localStorage
  const fetchEventDataFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('serEventMasterData');
      if (!stored || stored === 'null' || stored === 'undefined' || stored.trim() === '') {
        // Nothing saved → treat as new event
        setEventData(null);
        setEventId(null);
        setSelectedEventTypeId(null);
        form.resetFields();
        // console.log('Starting new event (no local storage data).');
        return;
      }

      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        setEventData(parsed);
        setEventId(parsed.serEventMasterId);
        setSelectedEventTypeId(parsed.serEventTypeId);
      } else {
        setEventData(null);
        setEventId(null);
        setSelectedEventTypeId(null);
        form.resetFields();
      }
    } catch (error) {
      console.error('Failed to parse event data from localStorage:', error);
      setEventData(null);
      setEventId(null);
      setSelectedEventTypeId(null);
      form.resetFields();
    }
  }, [form]);


  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem('serEventMasterData');
      let eventData;
      if (stored)
        eventData = JSON.parse(stored);

      if (eventData?.serEventMasterId && !paymentLoading) {
        const priceResponse = await getPriceByEventMasterId({ id: eventData.serEventMasterId });
        if (priceResponse && priceResponse?.code && priceResponse?.result && priceResponse?.result?.length) {
          setArrPayment(priceResponse.result);
          setActiveRow(null);
        } else {
          setArrPayment([]);
        }
      }

    })();

  }, [eventData, paymentLoading])


  const getPaymentMethod = async () => {
    const priceResponse = await getAllPaymentMethods({});
    if (priceResponse && priceResponse?.code &&
      priceResponse?.result && priceResponse?.result?.length) {
      const arr = priceResponse.result.map((x, index) => {
        return {
          id: index + 1,
          label: x,
          value: x,
        }
      });
      setArrPaymentMethods(arr);
    } else {
      setArrPaymentMethods([]);
    }
  };


  useEffect(() => {
    getPaymentMethod();
    fetchLookupData();
    // fetchEventDataFromLocalStorage();
  }, []);
  // }, [fetchLookupData, fetchEventDataFromLocalStorage]);

  useEffect(() => {
    const stored = localStorage.getItem('serEventMasterData');
    let eventData;
    if (stored) {
      eventData = JSON.parse(stored);
      setEventId(eventData.serEventMasterId);
      setEventData(eventData);
      setSelectedEventTypeId(eventData.serEventTypeId);
    } else {
      setEventId(null);
      setEventData(null);
      setSelectedEventTypeId(null);
    }

    if (eventData) {
      // Prefill form
      // console.log('All event data by id:', eventData);
      // console.log('foodSelections by id:', eventData.foodSelections);
      const runningOrderValues = {};
      const runningOrderData = eventData.dtoEventRunningOrder || {};
      for (const field of Object.values(RUNNING_ORDER_FIELD_MAPPING).flat()) {
        runningOrderValues[field] = runningOrderData[field] ? moment(runningOrderData[field]) : null;
      }

      // Map Decor
      const decorSelections = {};
      // eventData.dtoEventDecorSelections?.forEach((decor) => {
      //   decor.selectedProperties.forEach((prop) => {
      //     const key = `${decor.serDecorCategoryId}_${prop.serPropertyId}`;
      //     decorSelections[key] = prop.serPropertyValueId;
      //   });
      // });


      const result = {};
      // console.log('DEcordata came from eventRecord', eventData.dtoEventDecorSelections);

      eventData.dtoEventDecorSelections.forEach((decor) => {
        const categoryId = decor.serDecorCategoryId;

        if (!result[categoryId]) {
          result[categoryId] = {};
        }

        if (decorPrice)
          decorPrice[categoryId] = decor?.numPrice || 0;


        decor.selectedProperties.forEach((prop) => {
          if (prop.serPropertyId && prop.serPropertyValueIds?.length > 0) {   // only map valid selected values
            result[categoryId][prop.serPropertyId] = prop.serPropertyValueIds[0];
            if (decorPropertyPrice)
              decorPropertyPrice[categoryId][prop.serPropertyId] = prop.numPrice;
          }
        });

        if (decor.userUploadedDocuments?.length) {
          setUserImage([{ ...decor.userUploadedDocuments[0], serDecorCategoryId: decor.serDecorCategoryId }]);
          result[categoryId].userUploadedDocuments = decor.userUploadedDocuments;
        }
      });

      // const foodSelections = {};
      // Object.keys(eventData.foodSelections).map((foodCategory) => {
      //   const itemsArray = eventData.foodSelections[foodCategory].length ?
      //     eventData.foodSelections[foodCategory].map((x) => x.serMenuFoodId) : [];
      //   foodSelections[foodCategory] = itemsArray;

      // });

      // Map flat foodSelections array (eventData.foodSelections) to dtoFoodMenu object structure
      // so that selected values are prefilled in food dropdowns (category->subCategory->serMenuItemId)
      // Use lookupData.foodMenu to map serMenuFoodId to category/subCategory/menuItem

      // Prepare a mapping: serMenuFoodId -> { categoryId, subCategoryId }
      const menuFoodIdToDropdown = {};
      let arrFoodMenu = [];
      const dtoFoodMenu = {};
      const dtoFoodMenuPrices = {};
      const dtoModifyPrice = {};
      setLoading(true);
      (async () => {
        const menuResponse = await getMenuWithPrices({
          numGuests: eventData.numNumberOfGuests || 10,
          numTables: eventData.numNumberOfTables || 10,
        });
        setLoading(false);
        if (menuResponse && menuResponse?.code == 200 && menuResponse?.result && menuResponse?.result.length) {
          arrFoodMenu = menuResponse.result;
          arrFoodMenu.forEach(category => {
            (category.subCategories || []).forEach(subCat => {
              if (!dtoModifyPrice[category.categoryId]) dtoModifyPrice[category.categoryId] = {};
              dtoModifyPrice[category.categoryId][subCat.subCategoryId] = 0;
              let mergedItems = [];
              if (Array.isArray(subCat.items)) mergedItems = mergedItems.concat(subCat.items);
              if (Array.isArray(subCat.compositeItems)) mergedItems = mergedItems.concat(subCat.compositeItems);
              mergedItems.forEach(item => {
                // Map by menu item id for dropdown population
                if (item.serMenuItemId) {
                  menuFoodIdToDropdown[item.serMenuItemId] = {
                    categoryId: category.categoryId,
                    subCategoryId: subCat.subCategoryId,
                    serMenuItemId: item.serMenuItemId,
                  };
                }
                else if (item?.parentMenuItemId) {
                  menuFoodIdToDropdown[item.parentMenuItemId] = {
                    categoryId: category.categoryId,
                    subCategoryId: subCat.subCategoryId,
                    serMenuItemId: item.parentMenuItemId,
                  };
                }
              });
            });
          });

          // Update lookupData.foodMenu with actual guest/table count menu (items already merged above)
          // Re-merge items the same way fetchFoodMenu does so dropdown options reflect correct data
          const mergedMenuForLookup = arrFoodMenu.map(category => ({
            ...category,
            subCategories: (category.subCategories || []).map(subCat => {
              const mergedItems = [
                ...(Array.isArray(subCat.items) ? subCat.items : []),
                ...(Array.isArray(subCat.compositeItems) ? subCat.compositeItems : []),
              ];
              return { ...subCat, items: mergedItems };
            }),
          }));
          setLookupData(prev => ({ ...prev, foodMenu: mergedMenuForLookup }));
          setFoodMenuReady(true);
          lastFetchedGuestTableRef.current = {
            numGuests: Number(eventData.numNumberOfGuests || 10),
            numTables: Number(eventData.numNumberOfTables || 10),
          };
        }
        // Object.values(eventData.foodSelections || {}).forEach(arr => {
        //   (arr || [])

        // eventData?.foodSelections && eventData.foodSelections?.length && eventData.foodSelections
        //   .forEach(x => {
        //     const map = menuFoodIdToDropdown[x?.serMenuItemId];
        //     if (map) {
        //       if (!dtoFoodMenu[map.categoryId]) dtoFoodMenu[map.categoryId] = {};
        //       dtoFoodMenu[map.categoryId][map.subCategoryId].push(map.serMenuItemId);
        //     }
        //   });

        // For multi-select: reflect as array of serMenuItemIds per category/subcategory
        const dtoCategoryPrices = {};
        const activePricesFromBackend = {}; // Track active prices for display
        const selectionsFromBackend = {}; // Track selections for reactive calculation

        // Handle new menuCategoriesSelection format from backend
        if (eventData?.menuCategoriesSelection && eventData.menuCategoriesSelection.length) {
          eventData.menuCategoriesSelection.forEach(category => {
            const catId = category.categoryId;
            if (!dtoFoodMenu[catId]) dtoFoodMenu[catId] = {};
            if (!dtoModifyPrice[catId]) dtoModifyPrice[catId] = {};
            if (!selectionsFromBackend[catId]) selectionsFromBackend[catId] = {};

            // Store active price for category (numFinalPrice from backend)
            activePricesFromBackend[catId] = {
              numFinalPrice: category.numFinalPrice,
              numPrice: category.numPrice,
              subCategories: {}
            };

            // Pre-fill category price input with backend numFinalPrice
            dtoCategoryPrices[catId] = category.numFinalPrice || '';

            (category.subCategories || []).forEach(subCat => {
              const subCatId = subCat.subCategoryId;
              if (!dtoFoodMenu[catId][subCatId]) dtoFoodMenu[catId][subCatId] = [];

              // Store active price for subcategory (numFinalPrice from backend)
              activePricesFromBackend[catId].subCategories[subCatId] = {
                numFinalPrice: subCat.numFinalPrice,
                numPrice: subCat.numPrice
              };

              // Pre-fill subcategory price input with backend numFinalPrice
              dtoModifyPrice[catId][subCatId] = subCat.numFinalPrice || '';

              // Add regular items
              (subCat.items || []).forEach(item => {
                if (item.serMenuItemId && !dtoFoodMenu[catId][subCatId].includes(item.serMenuItemId)) {
                  dtoFoodMenu[catId][subCatId].push(item.serMenuItemId);
                }
              });

              // Add composite items
              (subCat.compositeItems || []).forEach(item => {
                if (item.parentMenuItemId && !dtoFoodMenu[catId][subCatId].includes(item.parentMenuItemId)) {
                  dtoFoodMenu[catId][subCatId].push(item.parentMenuItemId);
                }
              });

              // Track selections for reactive calculation
              selectionsFromBackend[catId][subCatId] = [...dtoFoodMenu[catId][subCatId]];
            });
          });

          // Set active prices and selections state
          setActiveFoodPrices(activePricesFromBackend);
          setFoodMenuSelections(selectionsFromBackend);
        }
        // Fallback: Handle old foodSelections format for backward compatibility
        else if (eventData?.foodSelections && eventData.foodSelections.length) {
          eventData.foodSelections.forEach(x => {
            const map = menuFoodIdToDropdown[x?.serMenuItemId];
            if (map) {
              if (!dtoFoodMenu[map.categoryId]) dtoFoodMenu[map.categoryId] = {};
              if (!selectionsFromBackend[map.categoryId]) selectionsFromBackend[map.categoryId] = {};

              // Don't populate input field
              dtoModifyPrice[map.categoryId][map.subCategoryId] = '';

              // Make sure each subCategory is initialized as array for multiselect
              if (!Array.isArray(dtoFoodMenu[map.categoryId][map.subCategoryId])) {
                dtoFoodMenu[map.categoryId][map.subCategoryId] = [];
              }
              // Avoid duplicating IDs (in case of dirty data)
              if (!dtoFoodMenu[map.categoryId][map.subCategoryId].includes(map.serMenuItemId)) {
                dtoFoodMenu[map.categoryId][map.subCategoryId].push(map.serMenuItemId);
              }

              // Track selections
              selectionsFromBackend[map.categoryId][map.subCategoryId] = [...dtoFoodMenu[map.categoryId][map.subCategoryId]];
            }
          });

          setFoodMenuSelections(selectionsFromBackend);
        }

        // });



        // const groupedSelections = data.reduce((acc, item) => {
        //   const type = item.txtFoodType; 
        //   if (!acc[type]) acc[type] = [];
        //   acc[type].push(item.serMenuFoodId);
        //   return acc;
        // }, {});
        // console.log('after making data for food selection(format)', { dtoFoodSelections: groupedSelections });

        // "serEventMenuFoodId": 7515,
        //               "serMenuFoodId": 14,
        //               "txtMenuFoodCode": "STM001",
        //               "txtMenuFoodName": "Malai chicken",
        //               "txtFoodType": "Starters & Main course",
        //               "serEventMasterId": 24,
        //               "txtEventMasterCode": "EVT-004",
        //               "txtEventMasterName": "azs afd's Mehndi",
        //               "blnIsActive": true
        const extrasSelections = eventData.extrasSelections.reduce((acc, item) => {
          acc[item.serExtrasId] = item.serExtraOptionId;
          if (extraPrice && item?.numPrice)
            extraPrice[item.serExtrasId] = item?.numPrice || 0;
          return acc;
        }, {});

        const servicesSelections = (eventData.servicesSelections || []).reduce((acc, item) => {
          acc[item.serExtrasId] = item.serExtraOptionId;
          if (servicePrice && item?.numPrice)
            servicePrice[item.serExtrasId] = item?.numPrice || 0;
          return acc;
        }, {});
        const txtStatus = eventData.dtoEventQuoteAndStatus?.txtStatus || '';
        const numQuotedPrice = eventData.dtoEventQuoteAndStatus?.numQuotedPrice || 0;
        const numDiscount = eventData.dtoEventQuoteAndStatus?.numDiscount || 0;
        const numPaidAmount = eventData.dtoEventQuoteAndStatus?.numPaidAmount || 0;
        const numDecorAmountInit = eventData.dtoEventQuoteAndStatus?.numDecorAmount || 0;
        const numDecorExtrasVatInit = eventData.dtoEventQuoteAndStatus?.numDecorExtrasVat || 0;
        const numServicesAmountInit = eventData.dtoEventQuoteAndStatus?.numServicesAmount || 0;
        const numFoodAmountInit = eventData.dtoEventQuoteAndStatus?.numFoodAmount || 0;
        const numFinalAmountInit = eventData.dtoEventQuoteAndStatus?.numFinalAmount || 0;
        // const vendorMasterSelections = !!eventData?.vendorMasterSelections.length ?
        //   eventData?.vendorMasterSelections.map(x => x.serVendorId) : [];
        // setExtraPrice(extrasSelectionsPrices);
        // setDtoPrice(dtoModifyPrice);
        const tempTxtBrideFirstName = form.getFieldValue('txtBrideFirstName');

        // Pre-fill venue cascade from dtoEventVenue
        const dto = eventData.dtoEventVenue;
        let venueCityId = undefined;
        if (dto?.serVenueMasterId) {
          const owningCity = lookupData.venues.find(c =>
            c.venueMasters?.some(v => v.serVenueMasterId === dto.serVenueMasterId)
          );
          venueCityId = owningCity?.serCityId || undefined;
          setSelectedCityId(venueCityId || null);
          setSelectedVenueId(dto.serVenueMasterId);
        }

        form.setFieldsValue({
          ...eventData,
          dteEventDate: eventData.dteEventDate ? moment(eventData.dteEventDate, 'DD-MM-YYYY') : null,
          dtoEventRunningOrder: runningOrderValues,
          dtoEventDecorSelections: result,
          dtoFoodMenu,
          dtoFoodMenuPrices: dtoModifyPrice,
          dtoCategoryPrices,
          extrasSelections,
          servicesSelections,
          txtStatus,
          numDiscount,
          numQuotedPrice,
          numPaidAmount,
          numDecorAmount: numDecorAmountInit,
          numDecorExtrasVat: numDecorExtrasVatInit,
          numServicesAmount: numServicesAmountInit,
          numFoodAmount: numFoodAmountInit,
          numFinalAmount: numFinalAmountInit,
          serCityId: venueCityId,
          serVenueMasterId: dto?.serVenueMasterId || undefined,
          serVenueMasterDetailId: dto?.serVenueMasterDetailId || undefined,
          // vendorMasterSelections,
        });
      })();
    } else {
      // Reset states for new event
      setActiveFoodPrices({});
      setFoodMenuSelections({});
      if (!stored)
        (async () => {
          try {
            let code = '';
            const eventCode = await generateEventCode();
            if (!eventData && eventCode && eventCode?.code == 200 && eventCode?.result) {
              code = eventCode.result;
            }

            const date = moment(new Date());
            // setSelectedEventTypeId(fetchedEventTypes[0]?.serEventTypeId);
            form.setFieldsValue({
              // serEventTypeId: fetchedEventTypes[0]?.serEventTypeId || '',
              txtEventMasterCode: code,
              // numNumberOfGuests: '',
              // numNumberOfTables: 10,
              dteEventDate: date,
              txtStatus: 'Enquiry',
              isEditAllowed: true,
              // serVenueMasterId: fetchedVenues[0]?.serVenueMasterId || '',
            })

          } catch (error) {
            console.log('Server Error', error?.message);
            message.error('Something went wrong')
          }
        })();
    }

  }, [decorPropertyPrice, decorPrice, extraPrice, servicePrice]);

  const cleanObject = (obj) => {
    if (Array.isArray(obj)) {
      const cleanedArr = obj.map(cleanObject).filter((v) => v !== null && v !== undefined);
      return cleanedArr.length > 0 ? cleanedArr : undefined;
    } else if (typeof obj === 'object' && obj !== null) {
      const cleanedObj = {};
      Object.keys(obj).forEach((key) => {
        const value = cleanObject(obj[key]);
        if (value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)) {
          cleanedObj[key] = value;
        }
      });
      return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
    }
    return obj;
  };

  // const onFinishFailed = (errorInfo) => {
  //   if (errorInfo.errorFields.length > 0) {
  //     const firstErrorField = errorInfo.errorFields[0].name[0];
  //     const element = document.querySelector(`[id*='${firstErrorField}']`);

  //     if (element) {
  //       const yOffset = -80; // adjust based on your header height
  //       const y =
  //         element.getBoundingClientRect().top + window.pageYOffset + yOffset;

  //       window.scrollTo({ top: y, behavior: "smooth" });
  //       element.focus();
  //     }
  //   }
  // };


  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    // Scroll to the first invalid field
    const firstErrorField = errorInfo.errorFields?.[0];
    const element = document.querySelector(`[id*='${errorInfo.errorFields[0].name[0]}']`);
    if (firstErrorField) {
      form.scrollToField(firstErrorField.name[0], {
        behavior: "smooth",
        block: "start",
      });
      element.focus();
    }
  };

  const onFinish = async (values) => {
    try {

      if (loading)
        return

      // setLoaderLabel('');
      // setLoading(true);

      let totalPrice = 0;
      let extrasSelections = {};
      if (values?.extrasSelections) {
        extrasSelections = Object.entries(values?.extrasSelections)
          .filter(([key, value]) => value !== undefined && value !== null)
          .map(([key, value]) => ({
            serExtrasSelectionId: null,
            serExtrasId: Number(key),
            serExtraOptionId: value,
            numPrice: values?.extrasSelectionsPrices[key] || extraPrice[key] || 0
          }));
        // Calculate totalPrice from extrasSelections
        totalPrice = extrasSelections.reduce((sum, item) => {
          const price = Number(item.numPrice) || 0;
          return sum + price;
        }, 0);
      }

      let servicesSelections = [];
      if (values?.servicesSelections) {
        servicesSelections = Object.entries(values?.servicesSelections)
          .filter(([key, value]) => value !== undefined && value !== null)
          .map(([key, value]) => ({
            serExtrasSelectionId: null,
            serExtrasId: Number(key),
            serExtraOptionId: value,
            numPrice: values?.servicesSelectionsPrices[key] || servicePrice[key] || 0,
            blnIsServices: true,
          }));
        totalPrice += servicesSelections.reduce((sum, item) => sum + (Number(item.numPrice) || 0), 0);
      }
      // const reqBody = {
      //   ...values,
      //   dtoExtras,
      // };

      // console.log("Final body:", reqBody);
      const decorSelections = Object.entries(values.dtoEventDecorSelections || {})
        .map(([catId, props]) => {
          const { userUploadedDocuments, ...propertyEntries } = props || {};
          const selectedProperties = Object.entries(propertyEntries)
            .filter(([_, val]) => val !== undefined)
            .map(([propId, valueId]) => ({
              serPropertyId: Number(propId),
              serPropertyValueIds: [valueId],
              numPrice: values.dtoDecorPropertyPrices[catId][propId] || decorPropertyPrice[catId] && decorPropertyPrice[catId][propId] || 0,
            }));

          // const uploadedDocs = (userUploadedDocuments || []).map(({ documentFile, txtDocumentUrl, ...docMeta }) => docMeta);
          let uploadedImage;
          if (userImage?.length) {
            uploadedImage = { ...userImage[0] };
            delete uploadedImage.serDecorCategoryId;
          };
          return selectedProperties.length > 0
            // return selectedProperties.length > 0
            ? {
              serDecorCategoryId: Number(catId),
              numPrice: values.dtoDecorPrices[catId] || decorPrice[catId],
              selectedProperties,
              userUploadedDocuments: userImage?.length && userImage[0].serDecorCategoryId == catId ? [uploadedImage] : [],
            }
            : null;
        })
        .filter(Boolean);
      // We want a flat array representing all decor selections, considering property and/or category prices.
      // If the main category (decor) price exists, we ignore the sub-property prices; otherwise sum up the property prices.

      // Calculate total decor price based on user flexibility:
      let calculatedDecorSelections = [];
      let totalDecorPrice = 0;

      (decorSelections || []).forEach(decor => {
        if (!decor) return;
        // If category price present and > 0, use only that, ignore properties' price
        const categoryPrice = Number(decor.numPrice) || 0;
        if (categoryPrice > 0) {
          calculatedDecorSelections.push({
            serDecorCategoryId: decor.serDecorCategoryId,
            numPrice: categoryPrice,
            selectedProperties: decor.selectedProperties,
          });
          totalDecorPrice += categoryPrice;
        } else if (Array.isArray(decor.selectedProperties) && decor.selectedProperties.length > 0) {
          // Sum each property price
          let propTotal = decor.selectedProperties.reduce((sum, prop) => {
            const propPrice = Number(prop.numPrice) || 0;
            return sum + propPrice;
          }, 0);
          calculatedDecorSelections.push({
            serDecorCategoryId: decor.serDecorCategoryId,
            numPrice: propTotal,
            selectedProperties: decor.selectedProperties,
          });
          totalDecorPrice += propTotal;
        }
      });

      totalPrice = totalPrice + totalDecorPrice;
      // const MenuSelections = Object.entries(values.dtoFoodMenu || {})
      //   .map(([catId, props]) => {
      //     const subCategories = Object.entries(props || {})
      //       .filter(([_, val]) => val !== undefined)
      //       .map(([propId, valueId]) => ({
      //         subCategoryId: Number(propId),
      //         serMenuItemId: valueId,
      //       }));

      //     return subCategories.length > 0
      //       ? {
      //         categoryId: Number(catId),
      //         subCategories,
      //       }
      //       : null;
      //   })
      //   .filter(Boolean);

      // Build menuCategoriesSelection payload structure
      const menuCategoriesSelection = [];
      let foodTotalPrice = 0;

      (lookupData.foodMenu || []).forEach(category => {
        const catId = String(category.categoryId);
        const selectedSubCats = values.dtoFoodMenu?.[catId] || {};

        // Check if any items are selected in this category
        const hasSelectedItems = Object.values(selectedSubCats).some(items =>
          Array.isArray(items) ? items.length > 0 : items !== undefined && items !== null
        );

        if (!hasSelectedItems) return; // Skip categories with no selections

        let categoryTotalPrice = 0;
        const subCategoriesPayload = [];

        (category.subCategories || []).forEach(subCat => {
          const subCatId = String(subCat.subCategoryId);
          const selectedItemIds = selectedSubCats[subCatId] || [];
          const ids = Array.isArray(selectedItemIds) ? selectedItemIds : [selectedItemIds].filter(Boolean);

          if (ids.length === 0) return; // Skip subcategories with no selections

          // Build items array for this subcategory
          const itemsPayload = [];
          const compositeItemsPayload = [];
          let subCatItemsTotal = 0;

          ids.forEach(menuItemId => {
            // Search merged items array using the same OR logic as calculateFoodSubcategoryPrice
            // This handles all item shapes: regular-only, composite-only, or items with both IDs set
            const allItems = subCat.items || [];
            const foundItem = allItems.find(i => i.serMenuItemId === menuItemId || i.parentMenuItemId === menuItemId);

            // Also check original compositeItems array as fallback
            const resolvedItem = foundItem || (subCat.compositeItems || []).find(i => i.parentMenuItemId === menuItemId);

            if (!resolvedItem) return;
            const itemPrice = Number(resolvedItem.numFinalPrice) || 0;
            subCatItemsTotal += itemPrice;

            if (resolvedItem.parentMenuItemId) {
              // Composite item
              compositeItemsPayload.push({
                parentMenuItemId: resolvedItem.parentMenuItemId,
                txtparentMenuItemName: resolvedItem.txtparentMenuItemName,
                txtparentMenuItemCode: resolvedItem.txtparentMenuItemCode,
                txtparentMenuItemDesc: resolvedItem.txtparentMenuItemDesc || '',
                txtcomponenetNameLst: resolvedItem.txtcomponenetNameLst || [],
                components: resolvedItem.components || [],
                numPrice: itemPrice,
                numCalculatedPrice: itemPrice,
                numFinalPrice: itemPrice
              });
            } else {
              // Regular item
              itemsPayload.push({
                serMenuItemId: resolvedItem.serMenuItemId,
                txtCode: resolvedItem.txtCode,
                txtName: resolvedItem.txtName,
                txtShortName: resolvedItem.txtShortName || '',
                txtDescription: resolvedItem.txtDescription || '',
                txtRole: resolvedItem.txtRole || 'ITEM',
                serMenuItemRoleId: resolvedItem.serMenuItemRoleId || null,
                txtType: resolvedItem.txtType || 'Food',
                parentId: subCat.subCategoryId,
                numDisplayOrder: resolvedItem.numDisplayOrder || 0,
                blnIsSelectable: resolvedItem.blnIsSelectable || true,
                metadata: resolvedItem.metadata || {},
                numDefaultServingsPerGuest: resolvedItem.numDefaultServingsPerGuest || 1,
                txtPath: resolvedItem.txtPath || '',
                blnIsCateringItem: resolvedItem.blnIsCateringItem || false,
                blnIsActive: resolvedItem.blnIsActive !== false,
                blnIsCompostie: false,
                numPrice: itemPrice,
                numCalculatedPrice: itemPrice,
                numFinalPrice: itemPrice,
              });
            }
          });

          // Get subcategory price - user override or calculated from items
          const userSubCatPrice = values.dtoFoodMenuPrices?.[catId]?.[subCatId];
          const subCatNumPrice = subCatItemsTotal; // Sum of selected items
          const subCatNumFinalPrice = (userSubCatPrice !== undefined && userSubCatPrice !== null && userSubCatPrice !== '' && userSubCatPrice != '0')
            ? Number(userSubCatPrice)
            : subCatNumPrice;
          categoryTotalPrice += subCatNumFinalPrice;

          subCategoriesPayload.push({
            subCategoryId: subCat.subCategoryId,
            subCategoryName: subCat.subCategoryName,
            numPrice: subCatNumPrice,
            numFinalPrice: subCatNumFinalPrice,
            items: itemsPayload,
            compositeItems: compositeItemsPayload
          });
        });

        // Get category price - user override or sum of subcategory finals
        // For grouped categories (4,5,6), always read price from the group leader (4)
        const userCatPriceKey = (GROUPED_CATEGORY_IDS.includes(catId) && catId !== GROUP_PRICE_LEADER)
          ? String(GROUP_PRICE_LEADER)
          : catId;
        const userCatPrice = values.dtoCategoryPrices?.[userCatPriceKey];
        const catNumPrice = categoryTotalPrice; // Sum of subcategory final prices (kept for numPrice field, not used as fallback)
        // Only user-entered category price is considered — no fallback to item sum
        const catNumFinalPrice = (userCatPrice !== undefined && userCatPrice !== null && userCatPrice !== '' && userCatPrice != '0')
          ? Number(userCatPrice)
          : 0;
        foodTotalPrice += catNumFinalPrice;

        menuCategoriesSelection.push({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          numPrice: catNumPrice,
          numFinalPrice: catNumFinalPrice,
          subCategories: subCategoriesPayload
        });
      });

      totalPrice = totalPrice + foodTotalPrice;
      // Object.values(values.dtoFoodMenu || {}).forEach(subCats => {
      //   Object.values(subCats || {}).forEach(menuItemId => {
      //     if (menuItemId !== undefined && menuItemId !== null) {
      //       const foundItem = allMenuItems.find(item => item.serMenuItemId === menuItemId);
      //       if (foundItem) {
      //         flatMenuSelections.push({
      //           serMenuItemId: foundItem?.serMenuItemId,
      //           txtCode: foundItem?.txtCode,
      //           txtName: foundItem?.txtName,
      //           txtDescription: foundItem?.txtDescription,
      //           blnIsSelectable: foundItem?.blnIsSelectable,
      //           serParentMenuItemId: foundItem?.serParentMenuItemId,
      //         });
      //       }
      //     }
      //   });
      // });
      // console.log('Deecor Data ready for eventMaster payload', decorSelections);


      const runningOrderPayload = {};
      const runningOrderValues = values.dtoEventRunningOrder || {};
      Object.keys(runningOrderValues).forEach((field) => {
        if (runningOrderValues[field]) {
          runningOrderPayload[field] = moment(runningOrderValues[field]).toISOString();

        }
      });

      // if (values.numItineraryPrice) {
      //   totalPrice += Number(values.numItineraryPrice) || 0;
      // }
      // if (values.numServingDishesPrice) {
      //   totalPrice += Number(values.numServingDishesPrice) || 0;
      // }

      // const foodSelections = Object.fromEntries(
      //   Object.entries(values.foodSelections)
      //     .filter(([_, value]) => Array.isArray(value) && value.length > 0) // ignore undefined or empty
      //     .map(([key, value]) => [
      //       key,
      //       value.map(id => ({ serMenuFoodId: id }))
      //     ])
      // );
      const { txtStatus, numQuotedPrice, numDiscount, numPaidAmount,
        numDecorAmount: _dA, numDecorExtrasVat: _dV, numServicesAmount: _sA, numFoodAmount: _fA, numFinalAmount: _fAmt,
        serCityId, serVenueMasterId, serVenueMasterDetailId, ...rest } = values;

      const extrasAmountForQuote = Array.isArray(extrasSelections)
        ? extrasSelections.reduce((sum, item) => sum + (Number(item.numPrice) || 0), 0)
        : 0;
      const servicesAmountForQuote = servicesSelections.reduce((sum, item) => sum + (Number(item.numPrice) || 0), 0);
      const numDecorAmount = totalDecorPrice + extrasAmountForQuote;
      const numDecorExtrasVat = Math.round(numDecorAmount * 0.20 * 100) / 100;
      const numServicesAmount = servicesAmountForQuote;
      const numFoodAmount = foodTotalPrice;
      const computedQuotedPrice = numDecorAmount + numDecorExtrasVat + numServicesAmount + numFoodAmount;
      const computedDiscount = Number(numDiscount) || 0;
      const numFinalAmount = computedQuotedPrice - computedDiscount;

      const dtoEventQuoteAndStatus = {
        txtStatus: txtStatus || '',
        numDecorAmount,
        numDecorExtrasVat,
        numServicesAmount,
        numFoodAmount,
        numQuotedPrice: computedQuotedPrice,
        numDiscount: computedDiscount,
        numFinalAmount,
        numPaidAmount: numPaidAmount ? Number(numPaidAmount) : 0,
      }

      // Build dtoEventVenue from selected venue + hall
      let dtoEventVenue = null;
      if (serVenueMasterId) {
        let selectedVenue = null;
        for (const city of lookupData.venues) {
          const v = city.venueMasters?.find(v => v.serVenueMasterId === serVenueMasterId);
          if (v) { selectedVenue = v; break; }
        }
        if (selectedVenue) {
          const selectedHall = selectedVenue.venueMasterDetails
            ?.find(h => h.serVenueMasterDetailId === serVenueMasterDetailId) || null;
          dtoEventVenue = {
            serVenueMasterId: selectedVenue.serVenueMasterId,
            txtVenueCode: selectedVenue.txtVenueCode,
            txtVenueName: selectedVenue.txtVenueName,
            serVenueMasterDetailId: selectedHall?.serVenueMasterDetailId || null,
            txtHallCode: selectedHall?.txtHallCode || null,
            txtHallName: selectedHall?.txtHallName || null,
          };
        }
      }

      // const vendorMasterSelections = rest.vendorMasterSelections.map(x => {
      //   return {
      //     serVendorId: x,
      //   }
      // });
      const reqBody = {
        ...rest,
        serEventMasterId: eventData?.serEventMasterId || null,
        dteEventDate: values?.dteEventDate ? moment(values.dteEventDate).format('DD-MM-YYYY') : null,
        dtoEventDecorSelections: decorSelections,
        dtoEventRunningOrder: runningOrderPayload,
        menuCategoriesSelection,
        extrasSelections,
        servicesSelections,
        dtoEventQuoteAndStatus,
        dtoEventVenue,
        // vendorMasterSelections,
        // extrasSelections: null,
        //   Object.fromEntries(
        //     Object.entries(values.dtoEventDecorSelections || {}).map(([catId, props]) => [
        //       catId,
        //       Object.fromEntries(
        //         Object.entries(props || {}).filter(([_, val]) => val !== undefined)
        //       ),
        //     ]).filter(([_, props]) => Object.keys(props).length > 0) // remove empty categories
        //   ),
        // };
      }
      delete reqBody.dtoFoodMenu;
      delete reqBody.dtoFoodMenuPrices;
      delete reqBody.dtoCategoryPrices;
      delete reqBody.dtoDecorPrices;
      delete reqBody.dtoDecorPropertyPrices;
      delete reqBody.extrasSelectionsPrices;
      delete reqBody.servicesSelectionsPrices;

      // console.log('Server Eror', reqBody);

      // return

      // console.log('payload', reqBody);

      const formData = new FormData();
      formData.append('eventMaster', JSON.stringify(reqBody));
      if (false)
        formData.append('files', null);

      const data = await editEventDetail(formData);
      if (data && data?.code == 200) {
        navigate('/event-stats');
        message.success(data?.message || 'Data saved successfully');
        setLoading(false);
      } else {
        setLoading(false);
        message.error(data?.message || 'Error in saving data');
      }

    } catch (err) {
      console.error('Srever error:', err?.message || 'Something went wrong');
      message.error('Failed to save event.');
      setLoading(false);
    }
  };

  const downloadReport = async (label) => {
    try {
      if (loading)
        return;
      label == 'client' ? setLoaderLabel(label) : setLoaderLabel(label);
      setLoading(true);
      // let response;
      // response = label == 'client' ? await getClientSideEvent(eventId)
      //   : await getEventReport(eventId);
      let eventUrl = label == 'client' ? eventClientSideUrl : eventReportUrl;
      if (label == 'kitchen') {
        eventUrl = kitchen_itineraryReportUrl;
      }
      const baseURL = process.env.REACT_APP_API_URL;
      const reportUrl = `${baseURL}${eventUrl}/${eventId}`;

      const response = await fetch(reportUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      // Get response as Blob
      const blob = await response.blob();

      // Create object URL
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      window.open(url, "_blank");

      // (Optional) Revoke the object URL after some time to free memory
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);

      setLoading(false);

    } catch (error) {
      console.log('Server Error', error?.message);
      setLoading(false);
    }


  };

  const handlePaymentSubmit = async (values, files, storedDocumentId) => {
    setPaymentLoading(true);
    try {
      // Prepare FormData
      const formData = new FormData();
      let req = {
        ...values,
        serEventBudgetId: eventData?.serEventBudgetId,
        serEventMasterId: eventData?.serEventMasterId,
      }

      // Prepare documents array - handle both new files and existing documents
      const documents = [];

      if (Array.isArray(files) && files.length > 0) {
        files.forEach((f) => {
          if (f.originFileObj) {
            // New file upload - use stored document ID if available (replacement scenario)
            const docObj = {
              txtOriginalFileName: f.name || f.originFileObj.name || "file"
            };
            if (storedDocumentId) {
              docObj.serEventPaymentDocumentId = storedDocumentId;
            }
            documents.push(docObj);
          } else if (f.isExisting && f.originalDoc) {
            // Existing document from backend - preserve original data
            documents.push({
              serEventPaymentDocumentId: f.originalDoc.serEventPaymentDocumentId || null,
              txtOriginalFileName: f.originalDoc.txtOriginalFileName || f.name || "file",
              txtFilePath: f.originalDoc.txtFilePath || f.url || null,
            });
          }
        });
      }
      req.documents = documents;
      formData.append('payment', JSON.stringify(req));

      // Append only NEW files as binaries under 'files' key
      if (Array.isArray(files) && files.length > 0) {
        files.forEach((f, idx) => {
          if (f.originFileObj) {
            // Only append new files (those with originFileObj)
            formData.append('files', f.originFileObj, f.name || f.originFileObj.name || `file${idx}`);
          }
        });
      }

      const data = await saveUpdatePayment(formData);
      if (data && data?.code == 200) {
        message.success('Payment submitted successfully!');
        setPaymentModalVisible(false);
      } else {
        message.error('Failed to submit payment!');
      }

    } catch (err) {
      console.error('Server Error', err?.message);
      message.error('Failed to submit payment!');
    }
    setPaymentLoading(false);
  };

  const renderRunningOrderField = (field, label) => {
    const arr = RUNNING_ORDER_FIELD_MAPPING[2];

    // const arr = RUNNING_ORDER_FIELD_MAPPING[selectedEventTypeId] || RUNNING_ORDER_FIELD_MAPPING[2];
    if (selectedEventTypeId && arr?.includes(field)) {
      // if (RUNNING_ORDER_FIELD_MAPPING[selectedEventTypeId]?.includes(field)) {
      return (
        <Col span={8} key={field}>
          <Form.Item name={['dtoEventRunningOrder', field]} label={label}>
            <TimePicker
              size='large'
              format="HH:mm"
              style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PageHeader ghost title={eventId ? 'Update Event' : 'Create New Event'} subTitle={''} />
        <Spin spinning={loading} size="large" />
      </div>
      <Main>
        <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              dtoEventDecorSelections: {},
              dtoFoodMenu: {},
              dtoFoodMenuPrices: {},
              dtoCategoryPrices: {},
              dtoDecorPrices: {},
              dtoDecorPropertyPrices: {},
              extrasSelectionsPrices: {},
              servicesSelectionsPrices: {}
            }}
            disabled={isViewMode}
            // name="myForm"
            onFinishFailed={onFinishFailed}
            scrollToFirstError
          >
            {/* Event Details */}
            <div style={{ display: 'flex', justifyContent: 'space-between', }}>
              <h2>Event Details {loaderLabel} </h2>
              {!isViewMode && (
                <Form.Item style={{ textAlign: 'right', marginTop: '15px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {eventId && <Button type="primary" htmlType="button" onClick={() => downloadReport('internal')}
                      loading={loaderLabel == 'internal' && loading}
                    >
                      Itinerary Report
                    </Button>}
                    {eventId && <Button type="primary" htmlType="button" onClick={() => downloadReport('client')}
                      loading={loaderLabel == 'client' && loading}
                    >
                      Customer Proposal
                    </Button>}
                    {eventId && <Button type="primary" htmlType="button" onClick={() => downloadReport('kitchen')}
                      loading={loaderLabel == 'kitchen' && loading}
                    >
                      Kitchen Itinerary
                    </Button>}
                    <Button Button type="primary" htmlType="submit"
                      loading={!loaderLabel && loading}
                    >
                      {eventId ? 'Update' : 'Save'} Event
                    </Button>
                  </div>
                </Form.Item>
              )}
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="txtEventMasterCode"
                  label="Event Code">
                  <Input placeholder='Enter event code'
                    style={{
                      backgroundColor: true ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                      opacity: .6,
                    }}
                    disabled={true} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="txtEventMasterName" label="Event Name" rules={[{ required: true, message: 'please enter event name' }]}>
                  <Input
                    disabled={!!eventId}
                    style={{
                      backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                      opacity: .6,
                    }}
                    placeholder='Enter event name' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="serEventTypeId" label="Event Type" rules={[{
                  required: true,
                  message: 'please select type'
                }]}>

                  <Select
                    onChange={(value) => {
                      setSelectedEventTypeId(value)
                    }}
                    disabled={!!eventId}
                    placeholder="select type">
                    {lookupData.eventTypes.map((event) => (
                      <Option
                        key={event.serEventTypeId} value={event.serEventTypeId}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: '2px' }}>
                          {!!(event?.documents && event.documents?.length && event?.documents[0]?.txtDocumentUrl) && (
                            <img
                              src={event.documents[0]?.txtDocumentUrl}
                              alt={event.documents[0]?.originalName + event.serEventTypeId}
                              style={{ height: 40, width: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                          )}
                          {event.txtEventTypeName}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="dteEventDate" label="Event Date" rules={[{ required: true }]}>
                  {/* <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} /> */}
                  <DatePicker
                    format="DD-MM-YYYY"
                    style={{ width: '100%', height: 46, padding: "10px !important" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="numNumberOfGuests" label="Number of Guests" rules={[{ required: true }]}>
                  <Input style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} type="number" onBlur={handleGuestTableChange} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="numNumberOfTables" label="Number of Tables" rules={[{ required: true }]}>
                  <Input style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} type="number" onBlur={handleGuestTableChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="serCityId" label="City">
                  <Select
                    placeholder="Select a city"
                    allowClear
                    onChange={(val) => {
                      setSelectedCityId(val || null);
                      setSelectedVenueId(null);
                      form.setFieldsValue({ serVenueMasterId: undefined, serVenueMasterDetailId: undefined });
                    }}
                  >
                    {lookupData.venues.map((city) => (
                      <Option key={city.serCityId} value={city.serCityId}>
                        {city.txtCityName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                {(() => {
                  const venuesForCity = lookupData.venues.find(c => c.serCityId === selectedCityId)?.venueMasters || [];
                  return (
                    <Form.Item name="serVenueMasterId" label="Venue">
                      <Select
                        placeholder="Select a venue"
                        allowClear
                        disabled={!selectedCityId}
                        onChange={(val) => {
                          setSelectedVenueId(val || null);
                          form.setFieldsValue({ serVenueMasterDetailId: undefined });
                        }}
                      >
                        {venuesForCity.map((venue) => (
                          <Option key={venue.serVenueMasterId} value={venue.serVenueMasterId}>
                            {venue.txtVenueName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  );
                })()}
              </Col>
              <Col span={8}>
                {(() => {
                  const venuesForCity = lookupData.venues.find(c => c.serCityId === selectedCityId)?.venueMasters || [];
                  const hallsForVenue = venuesForCity.find(v => v.serVenueMasterId === selectedVenueId)?.venueMasterDetails || [];
                  return (
                    <Form.Item name="serVenueMasterDetailId" label="Hall">
                      <Select
                        placeholder="Select a hall"
                        allowClear
                        disabled={!selectedVenueId}
                      >
                        {hallsForVenue.map((hall) => (
                          <Option key={hall.serVenueMasterDetailId} value={hall.serVenueMasterDetailId}>
                            {hall.txtHallName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  );
                })()}
              </Col>
              <Col span={16}>
                <Form.Item name="txtVenueRemarks" label="Venue Remarks" rules={[{ required: false }]}>
                  <Input.TextArea style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} rows={1} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              {/* <Col span={8}>
                <Form.Item
                  name="serVendorId"
                  label="Vendor"
                  rules={[{ required: false, message: 'Please select vendor' }]}
                >
                  <Select
                    mode="multiple" allowClear
                    placeholder="Select vendor">
                    {lookupData.vendors.filter(x => x.blnIsActive == true).map((item) => (
                      <Option key={item.serVendorId} value={item.serVendorId}>
                        {item.txtVendorName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col> */}
              <Col span={8}>
                <Form.Item
                  name="serCustId"
                  label="Customer"
                  rules={[{ required: true, message: 'please select customer' }]}
                >
                  <Select
                    disabled={!!eventId}
                    placeholder="Please select customer">
                    {
                      // !!eventId ? lookupData.customers.map((item) => (
                      //   <Option key={item.serCustId} value={item.serCustId}>
                      //     {item.txtCustName || item.txtFirstName + ' ' + item.txtLastName}
                      //   </Option>
                      // )) :
                      lookupData.customers.filter(x => x.blnIsActive == true).map((item) => (
                        <Option key={item.serCustId} value={item.serCustId}>
                          {item.txtCustName || item.txtFirstName + ' ' + item.txtLastName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="isEditAllowed" label="Enable Cutomer Edit" valuePropName="checked">
                  <Switch
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                    disabled={isViewMode}
                    defaultChecked // <--- FIX: Changed defaultChecked={true} to defaultChecked
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className='border-box' style={{ marginBottom: '15px' }}>
              <h2>Contact Person
                {/* {lookupData.decor.length}  */}
              </h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="txtContactPersonFirstName" label="First Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="txtContactPersonLastName" label="Last Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="txtContactPersonPhoneNo" label="Contact Number" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className='border-box' style={{ marginBottom: '15px' }}>
              <h2>Couple Detail
                {/* {lookupData.decor.length}  */}
              </h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="txtGroomFirstName" label="Groom First Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="txtGroomLastName" label="Groom Last Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="txtBrideFirstName" label="Bride First Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="txtBrideLastName" label="Bride Last Name" rules={[{ required: true }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="text" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Running Order */}
            {!!selectedEventTypeId && <h2>Running Order</h2>}
            <Row gutter={16}>
              {/* <Col span={24}>
              </Col> */}
              {renderRunningOrderField('txtGuestArrival', 'Guest Arrival')}
              {renderRunningOrderField('txtBrideGuestArrival', 'Bride Guest Arrival')}
              {renderRunningOrderField('txtGroomGuestArrival', 'Groom Guest Arrival')}
              {renderRunningOrderField('txtBaratArrival', 'Barat Arrival')}
              {renderRunningOrderField('txtNikah', 'Nikah')}
              {renderRunningOrderField('txtBrideEntrance', 'Bride Entrance')}
              {renderRunningOrderField('txtGroomEntrance', 'Groom Entrance')}
              {renderRunningOrderField('txtCouplesEntrance', 'Couples Entrance')}
              {renderRunningOrderField('txtDua', 'Dua')}
              {renderRunningOrderField('txtRingExchange', 'Ring Exchange')}
              {renderRunningOrderField('txtCakeCutting', 'Cake Cutting')}
              {renderRunningOrderField('txtRams', 'Rassams')}
              {renderRunningOrderField('txtSpeeches', 'Speeches')}
              {renderRunningOrderField('txtDance', 'Dance')}
              {renderRunningOrderField('txtMeal', 'Meal')}
              {renderRunningOrderField('txtEndOfNight', 'End of Night')}
            </Row>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="txtEventRemarks" label="Event Date Remarks" rules={[{ required: false }]}>
                  <Input.TextArea style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} rows={1} />
                </Form.Item>
              </Col>
            </Row>

            {/* <div style={{ border: '2px solid #f5f5f5', borderRadius: '10px', padding: '15px' }}> */}
            <div className='border-box'>
              <h2>Food Menu
              </h2>
              {!foodMenuReady ? (
                <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>
                  Please enter Number of Guests and Number of Tables to load the food menu.
                </div>
              ) : (
                <Spin spinning={foodMenuLoading} tip="Updating menu...">
                  <Row gutter={16}>
                    {lookupData.foodMenu.map((cat) => {
                      return (
                        <Col span={24} key={cat.categoryId}>
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{cat.categoryName == 'STARTERS' ? 'STARTERS & MAIN COURSE' : cat.categoryName}</h3>
                                {/* Only show category price input for non-grouped categories and the group leader (catId 4).
                                    catId 5 and 6 share the price entered for catId 4. */}
                                {!(GROUPED_CATEGORY_IDS.includes(cat.categoryId) && cat.categoryId !== GROUP_PRICE_LEADER) && (
                                  <Form.Item
                                    name={['dtoCategoryPrices', String(cat.categoryId)]}
                                    rules={[{ required: false }]}
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                      <Input
                                        size="small"
                                        type="number"
                                        min={0}
                                        style={{
                                          fontSize: 13,
                                          borderRadius: 6,
                                          background: '#fafafd',
                                          border: '1px solid #d2d2e4',
                                          marginLeft: 2,
                                          marginRight: 4,
                                        }}
                                        placeholder="Price"
                                        onChange={e => handleCategoryPriceChange(cat.categoryId, e.target.value)}
                                      />
                                    </span>
                                  </Form.Item>
                                )}
                              </div>
                              {/* "Total Price" label hidden — item-level totals are not considered */}
                              {/* Applied badge: only show in edit mode for non-grouped or group leader categories */}
                              {!!eventId && !(GROUPED_CATEGORY_IDS.includes(cat.categoryId) && cat.categoryId !== GROUP_PRICE_LEADER) && activeFoodPrices[cat.categoryId]?.numFinalPrice != null && (
                                <span
                                  title="Click to apply as price"
                                  onClick={() => handleCategoryPriceChange(cat.categoryId, activeFoodPrices[cat.categoryId].numFinalPrice)}
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    marginTop: 3, cursor: 'pointer',
                                    background: '#e6f4ff', border: '1px solid #91caff',
                                    borderRadius: 4, padding: '1px 7px',
                                    color: '#1677ff', fontSize: 12, userSelect: 'none',
                                    width: 'fit-content',
                                  }}
                                >
                                  <span style={{ fontWeight: 600 }}>Price:</span>&nbsp;£{activeFoodPrices[cat.categoryId].numFinalPrice}
                                  <span style={{ fontSize: 10, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                                </span>
                              )}
                            </div>
                            <Row gutter={16}>
                              {cat.subCategories.map((prop) => {
                                // Get reactive selections from state for Items Total calculation
                                const selectedItems = foodMenuSelections[cat.categoryId]?.[prop.subCategoryId] || [];
                                const calculatedSubCatPrice = calculateFoodSubcategoryPrice(cat.categoryId, prop.subCategoryId, selectedItems, lookupData.foodMenu);

                                return (
                                  <Col span={8} key={prop.subCategoryId}>
                                    <Form.Item
                                      name={['dtoFoodMenu', String(cat.categoryId), String(prop.subCategoryId)]}
                                      label={<>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                          {prop.subCategoryName}
                                          {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                                            <Form.Item
                                              name={['dtoFoodMenuPrices', String(cat.categoryId), String(prop.subCategoryId)]}
                                              rules={[{ required: false }]}
                                              style={{ padding: 0, margin: 0 }}
                                            >
                                              <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                                <Input
                                                  size="small"
                                                  type="number"
                                                  min={0}
                                                  style={{
                                                    fontSize: 13,
                                                    borderRadius: 6,
                                                    background: '#fafafd',
                                                    border: '1px solid #d2d2e4',
                                                    marginLeft: 2,
                                                    marginRight: 4,
                                                  }}
                                                  placeholder="Price"
                                                  onChange={e => handleFoodPriceChange(cat.categoryId, prop.subCategoryId, e.target.value)}
                                                />
                                              </span>
                                            </Form.Item>
                                          </div> */}
                                          {/* Items Total hidden — item-level pricing is no longer considered */}
                                          {/* <h5 style={{ margin: '2px 0 0 0', color: '#666', fontSize: 11 }}>
                                            Items Total: £{calculatedSubCatPrice || 0}
                                          </h5> */}
                                          {/* Subcategory applied-price badge disabled — only category price is used */}
                                          {/* {activeFoodPrices[cat.categoryId]?.subCategories?.[prop.subCategoryId]?.numFinalPrice != null && (
                                            <span
                                              title="Click to apply as override price"
                                              onClick={() => handleFoodPriceChange(cat.categoryId, prop.subCategoryId, activeFoodPrices[cat.categoryId].subCategories[prop.subCategoryId].numFinalPrice)}
                                              style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                marginTop: 2, cursor: 'pointer',
                                                background: '#e6f4ff', border: '1px solid #91caff',
                                                borderRadius: 4, padding: '1px 6px',
                                                color: '#1677ff', fontSize: 10, userSelect: 'none',
                                                width: 'fit-content',
                                              }}
                                            >
                                              <span style={{ fontWeight: 600 }}>Price:</span>&nbsp;£{activeFoodPrices[cat.categoryId].subCategories[prop.subCategoryId].numFinalPrice}
                                              <span style={{ fontSize: 9, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                                            </span>
                                          )} */}
                                        </div>

                                        {/* <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                  <Input
                                    name={`dtoFoodMenuPrices_${cat.categoryId}_${prop.subCategoryId}`}
                                    size="small"
                                    type="number"
                                    min={0}
                                    style={{
                                      width: 80,
                                      fontSize: 13,
                                      borderRadius: 6,
                                      background: '#fafafd',
                                      border: '1px solid #d2d2e4',
                                      marginLeft: 2,
                                      marginRight: 4,
                                    }}
                                    placeholder="Price"
                                    value={form.getFieldValue(['dtoFoodMenuPrices', String(cat.categoryId), String(prop.subCategoryId)])}
                                    onChange={e => form.setFieldValue(
                                      ['dtoFoodMenuPrices', String(cat.categoryId), String(prop.subCategoryId)],
                                      e.target.value
                                    )}
                                  />
                                  <span style={{ fontSize: 12, color: '#777' }}>₹</span>
                                </span> */}
                                      </>}
                                    // rules={[{ required: prop.blnIsRequired }]}
                                    >
                                      <Select
                                        mode="multiple" allowClear
                                        placeholder={`Select ${prop.subCategoryName}`}
                                        optionLabelProp="label"
                                        onChange={(selectedIds) => handleFoodSelectionChange(cat.categoryId, prop.subCategoryId, selectedIds)}
                                      >

                                        {prop.items.map((val) => (
                                          // {prop.items.filter(x => x.blnIsActive == true).map((val) => (
                                          <Option
                                            key={val.serMenuItemId || val?.parentMenuItemId}
                                            value={val.serMenuItemId || val?.parentMenuItemId}
                                            label={val.txtName || val?.txtparentMenuItemName}
                                          >
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                              {val?.document?.txtDocumentUrl && (
                                                <img
                                                  src={val.document.txtDocumentUrl}
                                                  alt={val.document?.originalName + val.serPropertyValueId}
                                                  style={{ height: 40, width: 40, objectFit: "cover", borderRadius: 4 }}
                                                />
                                              )}
                                              <span style={{ display: 'flex' }}>{val.txtName || val.txtparentMenuItemName || ''}
                                                {/* (£{val?.numFinalPrice})  */}
                                              </span>
                                            </div>
                                          </Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                );
                              })}
                            </Row>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Spin>
              )}
              <Col span={16}>
                <Form.Item name="txtCateringRemarks" label="Food Menu Remarks" rules={[{ required: false }]}>
                  <Input.TextArea style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} rows={1} />
                </Form.Item>
              </Col>
            </div>
            <div className='border-box'>
              <h2>Service Selections</h2>
              <Row gutter={16}>
                {lookupData?.services?.map((service) => (
                  <Col span={8} key={service.serExtrasId}>
                    <Form.Item
                      key={service.serExtrasId}
                      name={['servicesSelections', String(service.serExtrasId)]}
                      rules={[{ required: false }]}
                      label={<div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'between' }}>
                          {service.txtExtrasName}
                          <Form.Item
                            name={['servicesSelectionsPrices', String(service.serExtrasId)]}
                            rules={[{ required: false }]}
                            style={{ padding: 0, margin: 0 }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                              <Input
                                size="small"
                                type="number"
                                min={0}
                                style={{
                                  fontSize: 13,
                                  borderRadius: 6,
                                  background: '#fafafd',
                                  border: '1px solid #d2d2e4',
                                  marginLeft: 2,
                                  marginRight: 4,
                                }}
                                placeholder="Price"
                                value={form.getFieldValue(['servicesSelectionsPrices', String(service.serExtrasId)])}
                                onChange={e => {
                                  form.setFieldValue(
                                    ['servicesSelectionsPrices', String(service.serExtrasId)],
                                    e.target.value)
                                }}
                              />
                            </span>
                          </Form.Item>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 3, cursor: 'pointer',
                            background: '#e6f4ff', border: '1px solid #91caff',
                            borderRadius: 4, padding: '1px 7px',
                            color: '#1677ff', fontSize: 12, userSelect: 'none',
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>Price:</span>&nbsp;£{servicePrice?.[service?.serExtrasId] || 0}
                          <span style={{ fontSize: 10, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                        </span>
                      </div>}
                    >
                      <Select placeholder={`Select option for ${service.txtExtrasName}`}>
                        {service.decorExtrasOptions?.map((opt) => (
                          <Option key={opt.serExtraOptionId} value={opt.serExtraOptionId}>
                            <div style={{ display: 'flex', gap: '8px', padding: '2px', alignItems: 'center' }}>
                              {opt.document?.txtDocumentUrl && (
                                <img src={opt.document.txtDocumentUrl} alt={opt.txtOptionName} style={{ height: 40 }} />
                              )}
                              {opt.txtOptionName}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                ))}
                <Col span={16}>
                  <Form.Item name="txtEventServicesRemarks" label="Service Remarks" rules={[{ required: false }]}>
                    <Input.TextArea style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} rows={1} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className='border-box'>
              <h2>Decor Selections
                {/* {lookupData.decor.length}  */}
              </h2>
              <Row gutter={16}>
                {lookupData.decor.filter(x => x.blnIsActive == true).map((cat) => (
                  <Col span={24} key={cat.serDecorCategoryId}>
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <h3>{cat.txtDecorCategoryName}</h3>
                          {/* Enter Price: */}
                          <Form.Item
                            name={['dtoDecorPrices', String(cat.serDecorCategoryId)]}
                            rules={[{ required: false }]}
                            style={{ padding: 0, margin: 0 }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                              <Input
                                size="small"
                                type="number"
                                min={0}
                                style={{
                                  fontSize: 13,
                                  borderRadius: 6,
                                  background: '#fafafd',
                                  border: '1px solid #d2d2e4',
                                  marginLeft: 2,
                                  marginRight: 4,
                                }}
                                placeholder="Price"
                                value={form.getFieldValue(['dtoDecorPrices', String(cat.serDecorCategoryId)])}
                                onChange={e => {
                                  form.setFieldValue(
                                    ['dtoDecorPrices', String(cat.serDecorCategoryId)],
                                    e.target.value)
                                }}
                              />
                            </span>
                          </Form.Item>
                        </div>
                        <span
                          title="Click to apply as override price"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 3, cursor: 'pointer',
                            background: '#e6f4ff', border: '1px solid #91caff',
                            borderRadius: 4, padding: '1px 7px',
                            color: '#1677ff', fontSize: 12, userSelect: 'none',
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>Price:</span>&nbsp;£{cat?.serDecorCategoryId && decorPrice[cat.serDecorCategoryId] || 0}
                          <span style={{ fontSize: 10, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                        </span>
                        {/*    <h5>Total Price: £{cat?.serDecorCategoryId && decorPrice[cat.serDecorCategoryId] || 0}</h5> */}

                      </div>
                      <Row gutter={16}>
                        {cat.categoryProperties.filter(x => x.blnIsActive == true).map((prop) => (
                          <Col span={8} key={prop.serPropertyId}>
                            <Form.Item
                              name={['dtoEventDecorSelections', String(cat.serDecorCategoryId), String(prop.serPropertyId)]}
                              label={<div style={{}}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                                  {prop.txtPropertyName}
                                  {/* Enter Price: */}
                                  <Form.Item
                                    name={['dtoDecorPropertyPrices', String(cat.serDecorCategoryId), String(prop.serPropertyId)]}
                                    // label={`${prop.subCategoryName} Price`}
                                    rules={[{ required: false }]}
                                    style={{ padding: 0, margin: 0 }}
                                  >
                                    <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                                      <Input
                                        size="small"
                                        type="number"
                                        min={0}
                                        style={{
                                          // width: 80,
                                          fontSize: 13,
                                          borderRadius: 6,
                                          background: '#fafafd',
                                          border: '1px solid #d2d2e4',
                                          marginLeft: 2,
                                          marginRight: 4,
                                        }}
                                        placeholder="Price"
                                        value={form.getFieldValue(['dtoDecorPropertyPrices', String(cat.serDecorCategoryId), String(prop.serPropertyId)])}
                                        onChange={e => {
                                          form.setFieldValue(
                                            ['dtoDecorPropertyPrices', String(cat.serDecorCategoryId), String(prop.serPropertyId)],
                                            e.target.value)
                                        }}
                                      />
                                    </span>
                                    {/* <span style={{ fontSize: '12px' }}> £
                                      </span> */}
                                  </Form.Item>
                                </div>
                                <span
                                  title="Click to apply as override price"
                                  style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    marginTop: 3, cursor: 'pointer',
                                    background: '#e6f4ff', border: '1px solid #91caff',
                                    borderRadius: 4, padding: '1px 7px',
                                    color: '#1677ff', fontSize: 12, userSelect: 'none',
                                    width: 'fit-content',
                                  }}
                                >
                                  <span style={{ fontWeight: 600 }}>Item Price:</span>&nbsp;£{decorPropertyPrice[cat.serDecorCategoryId] && decorPropertyPrice[cat.serDecorCategoryId][prop.serPropertyId] || prop?.numPrice || 0}
                                  <span style={{ fontSize: 9, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                                </span>
                                {/* <h5>Item Price: £{decorPropertyPrice[cat.serDecorCategoryId] && decorPropertyPrice[cat.serDecorCategoryId][prop.serPropertyId] || prop?.numPrice || 0}</h5> */}
                              </div>}
                              rules={[{ required: prop.blnIsRequired, message: 'please select ' + (prop?.txtPropertyName || 'this field') }]}
                            >
                              <Select
                                placeholder={`Select ${prop.txtPropertyName}`}
                                optionLabelProp="label"
                              >
                                {prop.propertyValues.filter(x => x.blnIsActive == true).map((val) => (
                                  <Option
                                    key={val.serPropertyValueId}
                                    value={val.serPropertyValueId}
                                    label={val.txtPropertyValue || val.document?.originalName}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                      {val?.document?.txtDocumentUrl && (
                                        <img
                                          src={val.document.txtDocumentUrl}
                                          alt={val.document?.originalName + val.serPropertyValueId}
                                          style={{ height: 40, width: 40, objectFit: "cover", borderRadius: 4 }}
                                        />
                                      )}
                                      <span style={{ display: 'flex' }}>{val.txtPropertyValue}</span>
                                    </div>
                                    {/* {val.txtDocumentUrl ? (
                                    <img
                                      src={val.txtDocumentUrl}
                                      alt={val.txtPropertyValue}
                                      style={{ height: 40 }}
                                    />
                                  ) : (
                                    val.txtPropertyValue
                                  )} */}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  </Col>
                ))}
              </Row>
              {/* Document Upload/View for Themed Stage Decor */}
              {lookupData?.decor
                ?.filter((cat) => cat.txtDecorCategoryName === "Themed Stage")
                .map((cat) => {
                  const selectedCategory = (form.getFieldValue('dtoEventDecorSelections') || {})[cat.serDecorCategoryId];
                  const userUploadedDoc = selectedCategory?.userUploadedDocuments?.[0];

                  const handleDeleteDoc = () => {
                    const allDecorSelections = form.getFieldValue("dtoEventDecorSelections") || {};
                    form.setFieldValue("dtoEventDecorSelections", {
                      ...allDecorSelections,
                      [cat.serDecorCategoryId]: {
                        ...(allDecorSelections[cat.serDecorCategoryId] || {}),
                        userUploadedDocuments: []
                      }
                    });
                  };

                  return (
                    <Row gutter={16} align="middle" key={cat.serDecorCategoryId} style={{}}>
                      <Col span={16}>
                        <Form.Item name="txtDecoreRemarks" label="Decor Remarks" rules={[{ required: false }]}>
                          <Input.TextArea style={{
                            // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                            borderColor: "#d9d9d9",
                            boxShadow: "none",
                          }} rows={1} />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        {userUploadedDoc && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, }}>
                            <span style={{ color: 'black', fontSize: 14, minWidth: 120 }}>User Uploaded Stage</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ position: 'relative', display: 'inline-block' }}>
                                <a href={userUploadedDoc.txtDocumentUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={userUploadedDoc.txtDocumentUrl}
                                    alt={userUploadedDoc.originalName}
                                    style={{ height: 64, width: 64, borderRadius: 6, objectFit: 'cover', border: '1px solid #eee', display: 'block' }}
                                  />
                                </a>
                                {/* <CloseCircleFilled
                                  onClick={handleDeleteDoc}
                                  style={{ position: 'absolute', top: -8, right: -8, color: '#ff4d4f', fontSize: 18, cursor: 'pointer', background: '#fff', borderRadius: '50%' }}
                                /> */}
                                <span style={{ fontSize: 11, color: '#7e7e7e', display: 'block', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                                  {userUploadedDoc.originalName}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  );
                })}
            </div>
            {/* <Row gutter={16}>
              {lookupData.decor.map((cat) => (
                <Col span={24}>
                  <div key={cat.serDecorCategoryId} style={{ marginBottom: 20 }}>
                    <h3>{cat.txtDecorCategoryName}</h3>
                    <Row gutter={16}>
                      {cat.categoryProperties.map((prop) => (
                        <Col span={8}>
                          <Form.Item
                            // name={['dtoEventDecorSelections', cat.txtDzecorCategoryName, prop.txtPropertyName, `${cat.serDecorCategoryId}_${prop.serPropertyId}`]}
                            key={prop.serPropertyId}
                            name={['dtoEventDecorSelections', cat.serDecorCategoryId, prop.serPropertyId]}
                            label={prop.txtPropertyName}
                            rules={[{ required: prop.blnIsRequired }]}
                          // rules={[{ required: prop.blnIsRequired }]}
                          >
                            <Select placeholder={`Select ${prop.txtPropertyName}`}>
                              {prop.propertyValues.map((val) => (
                                <Option key={val.serPropertyValueId} value={val.serPropertyValueId}>
                                  {val.txtDocumentUrl ? (
                                    <img src={val.txtDocumentUrl} alt={val.txtPropertyValue} style={{ height: 40 }} />
                                  ) : (
                                    val.txtPropertyValue
                                  )}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
              ))}
            </Row> */}

            {/* <div className='border-box'>
              <h2>
                Food Selections
              </h2>
              <Row gutter={16}>
                {lookupData.food.map((x, i) => (
                  <Col span={8} key={x.group + i}>
                    <div style={{ marginBottom: "1rem" }}>
                      <Form.Item
                        name={['foodSelections', x.group]}
                        label={labelModification[x.group] || x.group}
                        rules={[{ required: false }]}
                      >
                        <Select mode="multiple" allowClear placeholder={`Select ${x.group}`}>
                          {x.items.filter(x => x.blnIsActive == true).map((item) => (
                            <Option key={item.serMenuFoodId} value={item.serMenuFoodId}>
                              {item.txtMenuFoodName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </Col>
                ))}
              </Row>
            </div> */}

            <div className='border-box'>
              <h2>Extras Selections</h2>
              <Row gutter={16}>
                {lookupData?.extras?.map((extra) => (
                  <Col span={8} key={extra.serExtrasId}>
                    <Form.Item
                      key={extra.serExtrasId}
                      name={['extrasSelections', String(extra.serExtrasId)]}
                      rules={[{ required: false }]}
                      label={<div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'between' }}>
                          {extra.txtExtrasName}
                          <Form.Item
                            name={['extrasSelectionsPrices', String(extra.serExtrasId)]}
                            // label={`${prop.subCategoryName} Price`}
                            rules={[{ required: false }]}
                            style={{ padding: 0, margin: 0 }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
                              <Input
                                size="small"
                                type="number"
                                min={0}
                                style={{
                                  // width: 80,
                                  fontSize: 13,
                                  borderRadius: 6,
                                  background: '#fafafd',
                                  border: '1px solid #d2d2e4',
                                  marginLeft: 2,
                                  marginRight: 4,
                                }}
                                placeholder="Price"
                                value={form.getFieldValue(['extrasSelectionsPrices', String(extra.serExtrasId)])}
                                onChange={e => {
                                  form.setFieldValue(
                                    ['extrasSelectionsPrices', String(extra.serExtrasId)],
                                    e.target.value)
                                }}
                              />
                            </span>
                            {/* <span style={{ fontSize: '12px' }}> £
                                      </span> */}
                          </Form.Item>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            marginTop: 3, cursor: 'pointer',
                            background: '#e6f4ff', border: '1px solid #91caff',
                            borderRadius: 4, padding: '1px 7px',
                            color: '#1677ff', fontSize: 12, userSelect: 'none',
                            width: 'fit-content',
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>Price:</span>&nbsp;£{extraPrice[extra?.serExtrasId] || 0}
                          <span style={{ fontSize: 10, color: '#4096ff', marginLeft: 2 }}>↑ applied</span>
                        </span>
                        {/* <h5>Item Price: £{extraPrice[extra?.serExtrasId] || 0}</h5> */}
                      </div>
                      }
                    >
                      <Select placeholder={`Select option for ${extra.txtExtrasName}`}>
                        {extra.decorExtrasOptions?.map((opt) => (
                          <Option key={opt.serExtraOptionId} value={opt.serExtraOptionId}>
                            <div style={{ display: 'flex', gap: '8px', padding: '2px', alignItems: 'center' }}>
                              {opt.document?.txtDocumentUrl && (
                                <img src={opt.document.txtDocumentUrl} alt={opt.txtOptionName} style={{ height: 40 }} />
                              )}
                              {opt.txtOptionName}
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <Col span={16}>
                <Form.Item name="txtEventExtrasRemarks" label="Extras Remarks" rules={[{ required: false }]}>
                  <Input.TextArea style={{
                    // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                    borderColor: "#d9d9d9",
                    boxShadow: "none",
                  }} rows={1} />
                </Form.Item>
              </Col>
            </div>
            {/* <div className='border-box'>
              <h2>Itinerary Cost</h2>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="numItineraryPrice" label="Itinerary Amount" rules={[{ required: false }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="number"
                    // onChange={(e) => {
                    //   if (eventId)
                    //     return
                    //   if (e.target.value > 0) {
                    //     form.setFieldValue('txtStatus', 'Confirmed')
                    //   } else {
                    //     form.setFieldValue('txtStatus', 'Enquiry')
                    //   }
                    // }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="numServingDishesPrice" label="Dishes Amount" rules={[{ required: false }]}>
                    <Input style={{
                      // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                      borderColor: "#d9d9d9",
                      boxShadow: "none",
                    }} type="number"
                    // onChange={(e) => {
                    //   if (eventId)
                    //     return
                    //   if (e.target.value > 0) {
                    //     form.setFieldValue('txtStatus', 'Confirmed')
                    //   } else {
                    //     form.setFieldValue('txtStatus', 'Enquiry')
                    //   }
                    // }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div> */}
            {eventId && <div className='border-box'>
              <h2>Event Cost</h2>
              <Row gutter={16} style={{ marginBottom: 8 }}>
                <Col span={8}>
                  <Form.Item name="txtStatus" label="Status" rules={[{ required: false }]}>
                    <Select placeholder="Select status" disabled>
                      <Option value="Enquiry">Enquiry</Option>
                      <Option value="Quoted">Quoted</Option>
                      <Option value="Confirmed">Confirmed</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="numDiscount" label="Discount Amount (£)" rules={[{ required: false }]}>
                    <Input style={{ borderColor: '#d9d9d9', boxShadow: 'none' }} type="number" min={0} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Price Breakdown Card */}
              <div style={{ background: '#fafafa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '20px 24px', marginBottom: 24, maxWidth: 520 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14, color: '#1a1a1a' }}>Price Breakdown</div>

                {[
                  { label: 'Food & Menu', field: 'numFoodAmount' },
                  { label: 'Services', field: 'numServicesAmount' },
                  { label: 'Decor & Extras', field: 'numDecorAmount' },
                  { label: 'VAT (20% on Decor & Extras)', field: 'numDecorExtrasVat', muted: true },
                ].map(({ label, field, muted }) => (
                  <div key={field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: 13, color: muted ? '#8c8c8c' : '#333' }}>{label}</span>
                    <span style={{ fontSize: 13, color: muted ? '#8c8c8c' : '#333' }}>
                      £{Number(eventData?.dtoEventQuoteAndStatus?.[field] || 0).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0 7px', borderTop: '2px solid #d9d9d9', marginTop: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>Quoted Price (inc. VAT)</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
                    £{Number(eventData?.dtoEventQuoteAndStatus?.numQuotedPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: '#f5222d' }}>Discount</span>
                  <span style={{ fontSize: 13, color: '#f5222d' }}>
                    - £{Number(watchedDiscount || 0).toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6, marginTop: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'black' }}>Final Amount</span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#389e0d' }}>
                    £{Math.max(0, Number(eventData?.dtoEventQuoteAndStatus?.numQuotedPrice || 0) - Number(watchedDiscount || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', padding: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3>Amount</h3>
                  {< Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setActiveRow(null);
                      setPaymentModalVisible(true)
                    }}
                  >
                    Add Payment Info
                  </Button>}
                </div>
                <Table
                  dataSource={arrPayment || []}
                  rowKey={(record, idx) => record.serEventPaymentId || idx}
                  bordered
                  pagination={true}
                  style={{ background: '#fff' }}
                  columns={[
                    {
                      title: 'Date',
                      dataIndex: 'dtePaymentDate',
                      key: 'dtePaymentDate',
                      // render: (text, record) => record.date
                      //   ? moment(record.date).format('DD-MM-YYYY HH:mm')
                      //   : '--'
                    },
                    {
                      title: 'Amount (£)',
                      dataIndex: 'numAmount',
                      key: 'numAmount',
                      render: (text) => text !== undefined && text !== null ? Number(text).toFixed(2) : '--'
                    },
                    {
                      title: 'Method',
                      dataIndex: 'txtPaymentMode',
                      key: 'txtPaymentMode',
                      // render: (text) => text !== undefined && text !== null ? Number(text).toFixed(2) : '--'
                    },
                    // {
                    //   title: 'Updated By',
                    //   dataIndex: 'updatedBy',
                    //   key: 'updatedBy',
                    //   render: (text, record) => record.updatedBy || record.userName || "System"
                    // },
                    {
                      title: 'Remarks',
                      dataIndex: 'txtRemarks',
                      key: 'txtRemarks',
                      render: (text) => text || '--'
                    },
                    {
                      title: 'View Image',
                      key: 'viewImage',
                      align: 'center',
                      render: (_, record) => {
                        if (Array.isArray(record.documents) && record.documents.length > 0) {
                          return (
                            <Button
                              size="small"
                              type="link"
                              onClick={async () => {
                                try {
                                  for (const doc of record.documents) {
                                    if (doc.txtFilePath) {
                                      // Fetch the image as a blob and trigger download
                                      const response = await fetch(doc.txtFilePath, { method: 'GET' });
                                      if (!response.ok) throw new Error('Image not found');
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = doc.txtOriginalFileName || doc.txtFileName || 'payment_image.jpg';
                                      document.body.appendChild(a);
                                      a.click();
                                      setTimeout(() => {
                                        window.URL.revokeObjectURL(url);
                                        document.body.removeChild(a);
                                      }, 100);
                                    }
                                  }
                                } catch (err) {
                                  message.error('Failed to download image!');
                                }
                              }}
                            >
                              View Image
                            </Button>
                          )
                        }
                        return '--';
                      }
                    },
                    {
                      title: 'Action',
                      key: 'actions',
                      align: 'center',
                      render: (_, record, index) => (
                        !isViewMode &&
                        <Space size="middle">
                          <Button
                            className="btn-icon"
                            // type="link"
                            size="small"
                            // type="link"
                            // style={{ color: '#a0a0a0', fontSize: '16px', padding: '0 4px', backgroundColor: 'transparent' }}
                            onClick={() => {
                              if (record) {
                                setActiveRow(record);
                                setPaymentModalVisible(true);
                              }
                              // } else {
                              //   message.info('Edit price log not implemented yet.');
                              // }
                            }}
                          >
                            <UilEdit size={14} />
                          </Button>
                        </Space>
                      )
                    }
                  ]}
                />
              </div>

            </div>}
            {/* {true && (
              <Form.Item style={{ marginTop: '15px' }}>
               
              </Form.Item>
            )} */}
          </Form >
          <div style={{ display: 'flex', justifyContent: 'end', gap: '5px', marginTop: '30px' }}>
            <Button onClick={() => navigate('/event-stats')} htmlType="button" >
              {'Close'}
            </Button>
            {!isViewMode && <Button type="primary" htmlType="submit"
              onClick={() => {
                form.submit();
              }}
              loading={loading}>
              {eventId ? 'Update' : 'Save'} Event
            </Button>}
          </div>
        </div >
      </Main >
      {/* [{"key":"payment","value":"{\n  \"serEventPaymentId\": null,\n  \"serEventBudgetId\": null,\n  \"serEventMasterId\": 93,\n  \"numAmount\": 250000.00,\n  \"txtPaymentMode\": \"BANK_TRANSFER\",\n  \"txtTransactionRef\": \"TXN-93-0001\",\n  \"dtePaymentDate\": \"15-01-2026\",\n  \"txtPaymentStatus\": \"RECEIVED\",\n  \"txtRemarks\": \"Advance payment received for event 93\",\n  \"documents\": [\n    {\n      \"txtOriginalFileName\": \"payment1.jpg\",\n      \"txtFileName\":\"Admin Recipt\"\n    },\n\n     {\n      \"txtOriginalFileName\": \"payment2.jpeg\",\n      \"txtFileName\":\"Client Recipt\"\n    }\n  ]\n}","description":"","type":"text","uuid":"212311a5-d31c-4247-8ad5-c10ed2196244","enabled":true}] */}


      {/* Payment Modal: should be placed just above the closing `</>` tag (along with other modals/popups) */}
      <PaymentFormModal
        visible={paymentModalVisible}
        activeEvent={activeRow}
        arrPaymentMethods={arrPaymentMethods}
        onCancel={() => setPaymentModalVisible(false)}
        onSubmit={(payload, files, storedDocumentId) => handlePaymentSubmit(payload, files, storedDocumentId)}
        loading={paymentLoading}
      />

    </>
  );
};

export default EventMasterForm;
