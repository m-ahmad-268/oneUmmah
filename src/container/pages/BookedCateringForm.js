import { useState, useEffect, useCallback } from 'react';
import { Main } from '../styled';
import { Form, Input, Button, message, Select, Row, Col, Spin, DatePicker, TimePicker, Modal, Upload, Table } from 'antd';
import { Form as AntForm } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';
import moment from 'moment';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { DataService } from '../../config/dataService/dataService';
import { editEventDetail, eventClientSideUrl, eventReportUrl, generateCateringCode, getAllActiveEventTypesWithSubEvents, getAllCustomers, getAllFoodsByType, getAllVendors, getClientSideEvent, getEventReport, getMenu, getMenuWithPrices, getSaveOrUpdateAdminPortal, getPriceByCateringDeliveryId, saveCateringPayment, getAllPaymentMethods } from '../../services/commonService';
import { StyledFullModal } from './customer-modal-style';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Option, OptGroup } = Select;

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
        const payload = {
            ...values,
            dtePaymentDate: values.dtePaymentDate ? values.dtePaymentDate.format('YYYY-MM-DD') : null,
        };
        if (activeEvent) {
            payload.serCateringPaymentId = activeEvent?.serCateringPaymentId;
            payload.serDeliveryBookingId = activeEvent?.serDeliveryBookingId;
        }
        onSubmit(payload, fileList, storedDocumentId);
        form.resetFields();
        setFileList([]);
        setStoredDocumentId(null);
    };

    useEffect(() => {
        if (activeEvent && visible) {
            if (activeEvent?.documents && activeEvent.documents.length) {
                const existingFiles = activeEvent.documents.map((doc, index) => ({
                    uid: doc.serDocumentId || `existing-${index}`,
                    name: doc.txtOriginalFileName || doc.txtDocumentName || `file-${index}`,
                    status: 'done',
                    url: doc.txtFilePath || '',
                    isExisting: true,
                    originalDoc: doc,
                }));
                setFileList(existingFiles);
                // Store the first document's ID for reuse when replacing
                if (activeEvent.documents[0]?.serDocumentId) {
                    setStoredDocumentId(activeEvent.documents[0].serDocumentId);
                }
            }

            form.setFieldsValue({
                numAmount: activeEvent.numAmount || 0,
                txtRemarks: activeEvent.txtRemarks || '',
                txtPaymentMode: activeEvent.txtPaymentMode || undefined,
                dtePaymentDate: activeEvent.dtePaymentDate ? moment(activeEvent.dtePaymentDate, 'DD-MM-YYYY') : undefined,
            });
        }
    }, [activeEvent, visible]);

    const handleFileChange = ({ fileList: newFileList, file }) => {
        // If removing an existing file, preserve its document ID for replacement
        if (file.status === 'removed' && file.isExisting && file.originalDoc?.serDocumentId) {
            setStoredDocumentId(file.originalDoc.serDocumentId);
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
                                {arrPaymentMethods.map(x => (
                                    <Option key={x.id} value={x.value}>{x.label}</Option>
                                ))}
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
        </Modal>
    );
};

const formatDateForApi = (date) => (date ? date.toISOString() : null);
const formatTimeForApi = (time) => (time ? moment(time).format('HH:mm') : null);

const RUNNING_ORDER_FIELD_MAPPING = {
    2: ['txtGuestArrival', 'txtBrideEntrance', 'txtMeal', 'txtEndOfNight'],
    3: ['txtGuestArrival', 'txtBrideEntrance', 'txtGroomEntrance', 'txtDance', 'txtMeal', 'txtEndOfNight'],
    4: ['txtGuestArrival', 'txtBrideEntrance', 'txtMeal', 'txtEndOfNight'],
    5: ['txtGuestArrival', 'txtBrideEntrance', 'txtMeal', 'txtEndOfNight'],
};

const BookedCateringForm = ({ closeModal, activeRow, isViewMode, isModalVisible, getAllCateringTrigger }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loaderLabel, setLoaderLabel] = useState('');
    const [eventData, setEventData] = useState(null);
    const [eventId, setEventId] = useState(null);
    const [selectedEventTypeId, setSelectedEventTypeId] = useState(null);
    const labelModification = {
        'MainCourse': 'Main Course',
        'SaladAndCondiment': 'Salad And Condiment',
    };
    // const [isViewMode, setIsViewMode] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const [dtoPrice, setDtoPrice] = useState({});

    // Food Menu Pricing States
    const [activeFoodPrices, setActiveFoodPrices] = useState({});
    const [foodMenuSelections, setFoodMenuSelections] = useState({});
    const [showFoodMenu, setShowFoodMenu] = useState(false);

    // Payment States
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [arrPayment, setArrPayment] = useState([]);
    const [arrPaymentMethods, setArrPaymentMethods] = useState([]);
    const [activePaymentRow, setActivePaymentRow] = useState(null);

    const [lookupData, setLookupData] = useState({
        eventTypes: [],
        venues: [],
        extras: [],
        decor: [],
        foodMenu: [],
        customers: [],
        vendors: [],
    });

    // Helper to get item price
    const getItemPrice = (item) => {
        return Number(item?.numFinalPrice) || 0;
    };

    // Calculate sum of selected food items' prices for a subcategory
    const calculateFoodSubcategoryPrice = useCallback((categoryId, subCategoryId, selectedItemIds, foodMenuData) => {
        const menuData = foodMenuData || lookupData.foodMenu || [];
        if (!menuData || !menuData.length) return 0;

        const category = menuData.find(cat => cat.categoryId === categoryId);
        if (!category) return 0;

        const subCategory = category.subCategories?.find(sub => sub.subCategoryId === subCategoryId);
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
    }, [lookupData.foodMenu]);

    // Handler for food item selection change
    const handleFoodSelectionChange = useCallback((categoryId, subCategoryId, selectedItemIds) => {
        form.setFieldValue(['dtoFoodMenu', String(categoryId), String(subCategoryId)], selectedItemIds);
        setFoodMenuSelections(prev => ({
            ...prev,
            [categoryId]: {
                ...(prev[categoryId] || {}),
                [subCategoryId]: selectedItemIds || []
            }
        }));
    }, [form]);

    // Handler for manual subcategory price input change
    const handleFoodPriceChange = useCallback((categoryId, subCategoryId, value) => {
        form.setFieldValue(['dtoFoodMenuPrices', String(categoryId), String(subCategoryId)], value);
    }, [form]);

    // Handler for manual category price input change
    const handleCategoryPriceChange = useCallback((categoryId, value) => {
        form.setFieldValue(['dtoCategoryPrices', String(categoryId)], value);
    }, [form]);

    const fetchFoodMenu = useCallback(async (numGuests = 10, numTables = 10) => {
        const req = { numTables, numGuests };
        setLoading(true);
        const menuResponse = await getMenuWithPrices(req);
        const dtoModifyPrice = {};
        let arrFoodMenu = [];
        setLoading(false);
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

    const handleGuestTableChange = useCallback(async () => {
        const numGuests = form.getFieldValue('numNumberOfGuests');
        const numTables = form.getFieldValue('numNumberOfTables');
        if (!numGuests || !numTables) return;
        const { arrFoodMenu } = await fetchFoodMenu(numGuests || 10, numTables || 10);
        setLookupData(prev => ({ ...prev, foodMenu: arrFoodMenu }));
        setShowFoodMenu(true);
    }, [fetchFoodMenu, form]);

    // Get catering-specific payment methods
    const getPaymentMethod = async () => {
        const response = await getAllPaymentMethods({});
        if (response?.code === 200 && response?.result?.length) {
            const arr = response.result.map((x, index) => ({
                id: index + 1,
                label: x,
                value: x,
            }));
            setArrPaymentMethods(arr);
        } else {
            setArrPaymentMethods([]);
        }
    };

    // Load payments when activeRow changes
    useEffect(() => {
        (async () => {
            if (activeRow?.serDeliveryBookingId && !paymentLoading) {
                const response = await getPriceByCateringDeliveryId({ id: activeRow.serDeliveryBookingId });
                if (response?.code === 200 && response?.result?.length) {
                    setArrPayment(response.result);
                    setActivePaymentRow(null);
                } else {
                    setArrPayment([]);
                }
            }
        })();
    }, [activeRow, paymentLoading]);

    // Handle payment submit
    const handlePaymentSubmit = async (values, files, storedDocumentId) => {
        setPaymentLoading(true);
        try {
            const formData = new FormData();
            let req = {
                ...values,
                serDeliveryBookingId: activeRow?.serDeliveryBookingId,
            };

            const documents = [];
            if (Array.isArray(files) && files.length > 0) {
                files.forEach((f) => {
                    if (f.originFileObj) {
                        // New file upload - use stored document ID if available (replacement scenario)
                        const docObj = {
                            txtOriginalFileName: f.name || f.originFileObj.name || "file"
                        };
                        if (storedDocumentId) {
                            docObj.serDocumentId = storedDocumentId;
                        }
                        documents.push(docObj);
                    } else if (f.isExisting && f.originalDoc) {
                        documents.push({
                            serDocumentId: f.originalDoc.serDocumentId || null,
                            txtOriginalFileName: f.originalDoc.txtOriginalFileName || f.name || "file",
                            txtFilePath: f.originalDoc.txtFilePath || f.url || null,
                        });
                    }
                });
            }

            req.documents = documents;
            formData.append('payment', JSON.stringify(req));

            if (Array.isArray(files) && files.length > 0) {
                files.forEach((f, idx) => {
                    if (f.originFileObj) {
                        formData.append('files', f.originFileObj, f.name || f.originFileObj.name || `file${idx}`);
                    }
                });
            }

            const data = await saveCateringPayment(formData);
            if (data?.code === 200) {
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

    // useEffect(() => {
    //     if (location.pathname.includes('view')) {
    //         setIsViewMode(true);
    //     } else {
    //         setIsViewMode(false);
    //     }
    // }, [location.pathname]);
    useEffect(() => {
        if (activeRow) {
            form.resetFields();
            // const foodSelections = {};
            // activeRow.foodSelections && Object.keys(activeRow.foodSelections).map((foodCategory) => {
            //     const itemsArray = activeRow.foodSelections[foodCategory].length ?
            //         activeRow.foodSelections[foodCategory].map((x) => x.serMenuFoodId) : [];
            //     foodSelections[foodCategory] = itemsArray;

            // });

            const menuFoodIdToDropdown = {};
            const dtoFoodMenu = {};
            const dtoFoodMenuPrices = {};
            const dtoModifyPrice = {};
            let arrFoodMenu = [];
            (async () => {
                const menuResponse = await getMenuWithPrices({
                    numGuests: activeRow.numNumberOfGuests || 10,
                    numTables: activeRow.numNumberOfTables || 10,
                });
                setShowFoodMenu(true);
                if (menuResponse && menuResponse?.code == 200 && menuResponse?.result && menuResponse?.result.length) {
                    arrFoodMenu = menuResponse.result;
                    arrFoodMenu.forEach(category => {
                        (category.subCategories || []).forEach(subCat => {
                            if (!dtoModifyPrice[category.categoryId]) dtoModifyPrice[category.categoryId] = {};
                            dtoModifyPrice[category.categoryId][subCat.subCategoryId] = 0;
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
                            // (subCat.items || []).forEach(item => {
                            //     // Merge compositeItems with items so both appear in dropdowns
                            //     let mergedItems = [];
                            //     if (Array.isArray(subCat.items)) mergedItems = mergedItems.concat(subCat.items);
                            //     if (Array.isArray(subCat.compositeItems)) mergedItems = mergedItems.concat(subCat.compositeItems);
                            //     mergedItems.forEach(item => {
                            //         // Map by menu item id for dropdown population
                            //         menuFoodIdToDropdown[item.serMenuItemId] = {
                            //             categoryId: category.categoryId,
                            //             subCategoryId: subCat.subCategoryId,
                            //             serMenuItemId: item.serMenuItemId,
                            //         };
                            //     });
                            // })
                        });
                    });
                    // arrFoodMenu.forEach(category => {
                    //     (category.subCategories || []).forEach(subCat => {
                    //         (subCat.items || []).forEach(item => {
                    //             // Map by menu item id for dropdown population
                    //             menuFoodIdToDropdown[item.serMenuItemId] = {
                    //                 categoryId: category.categoryId,
                    //                 subCategoryId: subCat.subCategoryId,
                    //                 serMenuItemId: item.serMenuItemId,
                    //             };
                    //         });
                    //     });
                    // });
                }
                // Compose dtoFoodMenu for Antd dropdowns: { [categoryId]: { [subCategoryId]: serMenuItemId } }

                // const dtoFoodMenu = {};
                // activeRow?.foodSelections && activeRow.foodSelections.length && activeRow.foodSelections.forEach(x => {
                //     const map = menuFoodIdToDropdown[x?.serMenuItemId];
                //     if (map) {
                //         if (!dtoFoodMenu[map.categoryId]) dtoFoodMenu[map.categoryId] = {};
                //         // if (!dtoFoodMenuPrices[map.categoryId]) dtoFoodMenuPrices[map.categoryId] = {};
                //         // dtoFoodMenuPrices[map.categoryId][map.subCategoryId] = x?.numPrice ? String(x.numPrice) : '';
                //         dtoModifyPrice[map.categoryId][map.subCategoryId] = x?.numPrice || 0;
                //         // Make sure each subCategory is initialized as array for multiselect
                //         if (!Array.isArray(dtoFoodMenu[map.categoryId][map.subCategoryId])) {
                //             dtoFoodMenu[map.categoryId][map.subCategoryId] = [];
                //         }
                //         // Avoid duplicating IDs (in case of dirty data)
                //         if (!dtoFoodMenu[map.categoryId][map.subCategoryId].includes(map.serMenuItemId)) {
                //             dtoFoodMenu[map.categoryId][map.subCategoryId].push(map.serMenuItemId);
                //         }
                //         return;
                //     }
                // });

                // Object.values(eventData.foodSelections || {}).forEach(arr => {
                //   (arr || [])
                // activeRow?.foodSelections && activeRow.foodSelections?.length && activeRow.foodSelections
                //     .forEach(x => {
                //         const map = menuFoodIdToDropdown[x?.serMenuItemId];
                //         if (map) {
                //             if (!dtoFoodMenu[map.categoryId]) dtoFoodMenu[map.categoryId] = {};
                //             // Only fill the first selected item per category+subCategory (can extend to array if needed)
                //             dtoFoodMenu[map.categoryId][map.subCategoryId] = map.serMenuItemId;
                //         }
                //     });
                // Parse menuCategoriesSelection to pre-populate food menu selections in edit mode
                const dtoCategoryPrices = {};
                const activePricesFromBackend = {};
                const selectionsFromBackend = {};

                if (activeRow?.menuCategoriesSelection && activeRow.menuCategoriesSelection.length) {
                    activeRow.menuCategoriesSelection.forEach(category => {
                        const catId = category.categoryId;
                        if (!dtoFoodMenu[catId]) dtoFoodMenu[catId] = {};
                        if (!dtoModifyPrice[catId]) dtoModifyPrice[catId] = {};
                        if (!selectionsFromBackend[catId]) selectionsFromBackend[catId] = {};

                        activePricesFromBackend[catId] = {
                            numFinalPrice: category.numFinalPrice,
                            numPrice: category.numPrice,
                            subCategories: {}
                        };

                        dtoCategoryPrices[catId] = '';

                        (category.subCategories || []).forEach(subCat => {
                            const subCatId = subCat.subCategoryId;
                            if (!dtoFoodMenu[catId][subCatId]) dtoFoodMenu[catId][subCatId] = [];

                            activePricesFromBackend[catId].subCategories[subCatId] = {
                                numFinalPrice: subCat.numFinalPrice,
                                numPrice: subCat.numPrice
                            };

                            dtoModifyPrice[catId][subCatId] = '';

                            (subCat.items || []).forEach(item => {
                                if (item.serMenuItemId && !dtoFoodMenu[catId][subCatId].includes(item.serMenuItemId)) {
                                    dtoFoodMenu[catId][subCatId].push(item.serMenuItemId);
                                }
                            });

                            (subCat.compositeItems || []).forEach(item => {
                                if (item.parentMenuItemId && !dtoFoodMenu[catId][subCatId].includes(item.parentMenuItemId)) {
                                    dtoFoodMenu[catId][subCatId].push(item.parentMenuItemId);
                                }
                            });

                            selectionsFromBackend[catId][subCatId] = [...dtoFoodMenu[catId][subCatId]];
                        });
                    });

                    setActiveFoodPrices(activePricesFromBackend);
                    setFoodMenuSelections(selectionsFromBackend);
                }
                // Fallback: Handle old foodSelections format

                // else if (activeRow?.foodSelections && activeRow.foodSelections.length) {
                //     activeRow.foodSelections.forEach(x => {
                //         const map = menuFoodIdToDropdown[x?.serMenuItemId];
                //         if (map) {
                //             if (!dtoFoodMenu[map.categoryId]) dtoFoodMenu[map.categoryId] = {};
                //             if (!selectionsFromBackend[map.categoryId]) selectionsFromBackend[map.categoryId] = {};

                //             dtoModifyPrice[map.categoryId][map.subCategoryId] = '';

                //             if (!Array.isArray(dtoFoodMenu[map.categoryId][map.subCategoryId])) {
                //                 dtoFoodMenu[map.categoryId][map.subCategoryId] = [];
                //             }
                //             if (!dtoFoodMenu[map.categoryId][map.subCategoryId].includes(map.serMenuItemId)) {
                //                 dtoFoodMenu[map.categoryId][map.subCategoryId].push(map.serMenuItemId);
                //             }

                //             selectionsFromBackend[map.categoryId][map.subCategoryId] = [...dtoFoodMenu[map.categoryId][map.subCategoryId]];
                //         }
                //     });

                //     setFoodMenuSelections(selectionsFromBackend);
                // }

                setDtoPrice(dtoModifyPrice);
                setVisible(true);
                form.setFieldsValue({
                    ...activeRow,
                    txtStatus: activeRow?.dtoEventQuoteAndStatus?.txtStatus || '',
                    numQuotedPrice: "£" + activeRow?.dtoEventQuoteAndStatus?.numQuotedPrice || '',
                    dteDeliveryDate: activeRow.dteDeliveryDate ? moment(activeRow.dteDeliveryDate, 'DD-MM-YYYY') : null,
                    serEventTypeId: activeRow?.serEventTypeId || null,
                    dtoFoodMenu,
                    dtoFoodMenuPrices: dtoModifyPrice,
                    dtoCategoryPrices,
                });
                handleGuestTableChange();
            })();
        } else {
            // console.log('activeRow+ViewMode', activeRow);
            if (!isModalVisible)
                return
            (async () => {
                try {
                    let code;
                    const eventCode = await generateCateringCode();
                    if (eventCode && eventCode?.code == 200 && eventCode?.result) {
                        code = eventCode.result;
                    }

                    const date = moment(new Date());
                    // setSelectedEventTypeId(fetchedEventTypes[0]?.serEventTypeId);
                    form.resetFields();
                    setActiveFoodPrices({});
                    setVisible(false);
                    form.setFieldsValue({
                        txtDeliveryBookingCode: code,
                        dteDeliveryDate: date,
                        // serEventTypeId: fetchedEventTypes[0]?.serEventTypeId || '',
                        // numNumberOfGuests: 10,
                        // numNumberOfTables: 10,
                        // dteEventDate: date,
                        // serVenueMasterId: fetchedVenues[0]?.serVenueMasterId || '',
                    })

                } catch (error) {
                    console.log('Server Error', error?.message);
                    message.error('Something went wrong')
                }
            })();
        }

    }, [activeRow, isModalVisible, closeModal]);

    const accessToken = localStorage.getItem('access_token_admin');

    // Fetch Lookups (Events, Venues, Decor, Foods)
    const fetchLookupData = useCallback(async () => {
        setLoading(true);
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        };

        try {

            // --- Venues ---
            // const venuesRes = await fetch(`${process.env.REACT_APP_API_URL}venueMaster/getAllGroupedByCity`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const venuesJson = await venuesRes.json();
            // let fetchedVenues = [];
            // if (venuesJson.code === 200 && venuesJson.result) {
            //     venuesJson.result.forEach((city) => {
            //         if (city.venueMasters) fetchedVenues = fetchedVenues.concat(city.venueMasters);
            //     });
            // }

            // --- Decor ---
            // const decorRes = await fetch(`${process.env.REACT_APP_API_URL}decorCategoryMaster/getAllDecorMasterData`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const decorJson = await decorRes.json();
            // let fetchedDecor = [];
            // if (decorJson.code === 200 && decorJson.result) {
            //     fetchedDecor = decorJson.result;
            // }

            // const eventTypesRes = await fetch(`${process.env.REACT_APP_API_URL}eventType/getAllActiveEventTypesWithSubEvents`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const eventTypesJson = await getAllActiveEventTypesWithSubEvents();
            // let fetchedEventTypes = [];
            // if (eventTypesJson.code === 200 && eventTypesJson.result) {
            //     eventTypesJson.result.forEach((mainEvent) => {
            //         if (mainEvent.subEvents) fetchedEventTypes = fetchedEventTypes.concat(mainEvent.subEvents);
            //     });
            // }

            // const eventTypesRes = await fetch(`${process.env.REACT_APP_API_URL}eventType/getAllActiveEventTypesWithSubEvents`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const eventTypesJson = await eventTypesRes.json();
            const eventTypesJson = await getAllActiveEventTypesWithSubEvents();
            let fetchedEventTypes = [];
            if (eventTypesJson.code === 200 && eventTypesJson.result) {
                eventTypesJson.result.forEach((mainEvent) => {
                    if (mainEvent.subEvents) fetchedEventTypes = fetchedEventTypes.concat(mainEvent.subEvents);
                });
            }

            let activeCusotmers = [];
            const data = await getAllCustomers();
            if (data.code === 200 && data.result && data.result?.length) {
                activeCusotmers = [...data.result];
            }

            // const foodRes = await fetch(`${process.env.REACT_APP_API_URL}menuFoodMaster/getAllFoodsByType`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const foodJson = await foodRes.json();
            // const foodJson = await getAllFoodsByType();
            // let fetchedFood = [];
            // if (foodJson.code === 200 && foodJson.result) {
            //     Object.keys(foodJson.result).map((group) => {
            //         fetchedFood.push({ group, items: foodJson.result[group] });

            //     });
            // }

            let arrFoodMenu = [];
            // const dtoModifyPrice = {};
            // const menuResponse = await getMenuWithPrices({});
            // if (menuResponse && menuResponse?.code == 200 && menuResponse?.result && menuResponse?.result.length) {
            //     // arrFoodMenu = menuResponse.result;
            //     const arr = menuResponse.result.map(category => {
            //         return {
            //             ...category,
            //             subCategories: (category.subCategories || []).map(subCat => {
            //                 if (!dtoModifyPrice[category.categoryId]) dtoModifyPrice[category.categoryId] = {};
            //                 dtoModifyPrice[category.categoryId][subCat.subCategoryId] = 0;
            //                 // Merge both arrays, handle undefined/null cases
            //                 let mergedItems = [];
            //                 if (Array.isArray(subCat.items)) {
            //                     mergedItems = mergedItems.concat(subCat.items);
            //                 }
            //                 if (Array.isArray(subCat.compositeItems)) {
            //                     mergedItems = mergedItems.concat(subCat.compositeItems);
            //                 }
            //                 return {
            //                     ...subCat,
            //                     items: mergedItems,
            //                 };
            //             })
            //         }
            //     });
            //     arrFoodMenu = arr;
            // }

            // let activeVendors = [];
            // const resVendor = await getAllVendors();
            // if (resVendor.code === 200 && resVendor.result && resVendor.result?.length) {
            //     activeVendors = [...resVendor.result];
            // }

            // const extrasRes = await fetch(`${process.env.REACT_APP_API_URL}decorExtras/getAllData`, {
            //     method: 'POST',
            //     headers,
            //     body: JSON.stringify({}),
            // });
            // const extrasJson = await extrasRes.json();
            // let fetchedExtras = [];
            // if (extrasJson.code === 200 && extrasJson.result) {
            //     fetchedExtras = extrasJson.result;
            // }

            // setTimeout(() => {
            //     if (!activeRow)
            //         setDtoPrice(dtoModifyPrice);
            // }, 1000);
            setLookupData({
                eventTypes: fetchedEventTypes,
                // food: fetchedFood,
                foodMenu: arrFoodMenu,
                customers: activeCusotmers,
                // venues: fetchedVenues,
                // decor: fetchedDecor,
                // vendors: activeVendors,
                // extras: fetchedExtras,
            });

        } catch (err) {
            console.error('Lookup fetch error:', err);
            message.error('Failed to load lookup data.');
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

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
        getPaymentMethod();
        fetchLookupData();
        fetchEventDataFromLocalStorage();
    }, [fetchLookupData, fetchEventDataFromLocalStorage]);

    useEffect(() => {
        const stored = localStorage.getItem('serEventMasterData');
        if (eventData) {
            return
            // Prefill form
            // console.log('All event data by id:', eventData);
            // console.log('foodSelections by id:', eventData.foodSelections);

            const runningOrderValues = {};
            const runningOrderData = eventData.dtoEventRunningOrder || {};
            for (const field of Object.values(RUNNING_ORDER_FIELD_MAPPING).flat()) {
                runningOrderValues[field] = runningOrderData[field] ? moment(runningOrderData[field], 'HH:mm') : null;
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

                decor.selectedProperties.forEach((prop) => {
                    if (prop.serPropertyValueId) {   // only map valid selected values
                        result[categoryId][prop.serPropertyId] = prop.serPropertyValueId;
                    }
                });
            });

            // const foodSelections = {};
            // Object.keys(eventData.foodSelections).map((foodCategory) => {
            //     const itemsArray = eventData.foodSelections[foodCategory].length ?
            //         eventData.foodSelections[foodCategory].map((x) => x.serMenuFoodId) : [];
            //     foodSelections[foodCategory] = itemsArray;

            // });



            // console.log('here i have reinform data for poplating our food dropdown', foodSelections);


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
                return acc;
            }, {});

            const txtStatus = eventData.dtoEventQuoteAndStatus?.txtStatus || '';
            const numQuotedPrice = eventData.dtoEventQuoteAndStatus?.numQuotedPrice || 0;
            const numPaidAmount = eventData.dtoEventQuoteAndStatus?.numPaidAmount || 0;

            form.setFieldsValue({
                ...eventData,
                dteEventDate: eventData.dteEventDate ? moment(eventData.dteEventDate, 'DD-MM-YYYY') : null,
                dtoEventRunningOrder: runningOrderValues,
                dtoEventDecorSelections: result,
                // foodSelections: dtoFoodMenu,
                extrasSelections,
                txtStatus,
                numQuotedPrice,
                numPaidAmount,
            });
        }

    }, [eventData]);

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

            setLoaderLabel('');
            // setLoading(true);


            // let extrasSelections = {};
            // if (values?.extrasSelections) {
            //     extrasSelections = Object.entries(values?.extrasSelections)
            //         .filter(([key, value]) => value !== undefined && value !== null)
            //         .map(([key, value]) => ({
            //             serExtrasSelectionId: null,
            //             serExtrasId: Number(key),
            //             serExtraOptionId: value
            //         }));
            // }
            // const reqBody = {
            //   ...values,
            //   dtoExtras,
            // };

            // console.log("Final body:", reqBody);

            // const decorSelections = Object.entries(values.dtoEventDecorSelections || {})
            //     .map(([catId, props]) => {
            //         const selectedProperties = Object.entries(props || {})
            //             .filter(([_, val]) => val !== undefined)
            //             .map(([propId, valueId]) => ({
            //                 serPropertyId: Number(propId),
            //                 serPropertyValueId: valueId,
            //             }));

            //         return selectedProperties.length > 0
            //             ? {
            //                 serDecorCategoryId: Number(catId),
            //                 selectedProperties,
            //             }
            //             : null;
            //     })
            //     .filter(Boolean);

            // console.log('Deecor Data ready for eventMaster payload', decorSelections);


            // const runningOrderPayload = {};
            // const runningOrderValues = values.dtoEventRunningOrder || {};
            // Object.keys(runningOrderValues).forEach((field) => {
            //     if (runningOrderValues[field]) {
            //         runningOrderPayload[field] = moment(runningOrderValues[field]).format('HH:mm')

            //     }
            // });



            // const foodSelections = values?.foodSelections && Object.fromEntries(
            //     Object.entries(values.foodSelections)
            //         .filter(([_, value]) => Array.isArray(value) && value.length > 0) // ignore undefined or empty
            //         .map(([key, value]) => [
            //             key,
            //             value.map(id => ({ serMenuFoodId: id }))
            //         ])
            // );

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
                        // Check in merged items array (contains both regular and composite items)
                        let regularItem = (subCat.items || []).find(i => i.serMenuItemId === menuItemId);

                        if (regularItem && !regularItem.parentMenuItemId) {
                            // This is a regular item
                            // const itemPrice = Number(regularItem.numPrice) || 0;
                            const itemPrice = Number(regularItem.numFinalPrice) || 0;
                            subCatItemsTotal += itemPrice;
                            itemsPayload.push({
                                serMenuItemId: regularItem.serMenuItemId,
                                txtCode: regularItem.txtCode,
                                txtName: regularItem.txtName,
                                txtShortName: regularItem.txtShortName || '',
                                txtDescription: regularItem.txtDescription || '',
                                txtRole: regularItem.txtRole || 'ITEM',
                                serMenuItemRoleId: regularItem.serMenuItemRoleId || null,
                                txtType: regularItem.txtType || 'Food',
                                parentId: subCat.subCategoryId,
                                numDisplayOrder: regularItem.numDisplayOrder || 0,
                                blnIsSelectable: regularItem.blnIsSelectable || true,
                                metadata: regularItem.metadata || {},
                                numDefaultServingsPerGuest: regularItem.numDefaultServingsPerGuest || 1,
                                txtPath: regularItem.txtPath || '',
                                blnIsCateringItem: regularItem.blnIsCateringItem || false,
                                blnIsActive: regularItem.blnIsActive !== false,
                                blnIsCompostie: false,
                                numPrice: itemPrice,
                                numCalculatedPrice: itemPrice,
                                numFinalPrice: itemPrice,
                            });
                            return;
                        }

                        // Check for composite items
                        let compositeItem = (subCat.items || []).find(i => i.parentMenuItemId === menuItemId);
                        if (!compositeItem) {
                            compositeItem = (subCat.compositeItems || []).find(i => i.parentMenuItemId === menuItemId);
                        }

                        if (compositeItem) {
                            const itemPrice = Number(compositeItem.numFinalPrice) || 0;
                            // const itemPrice = Number(compositeItem.numPrice) || 0;
                            subCatItemsTotal += itemPrice;
                            compositeItemsPayload.push({
                                parentMenuItemId: compositeItem.parentMenuItemId,
                                txtparentMenuItemName: compositeItem.txtparentMenuItemName,
                                txtparentMenuItemCode: compositeItem.txtparentMenuItemCode,
                                txtparentMenuItemDesc: compositeItem.txtparentMenuItemDesc || '',
                                txtcomponenetNameLst: compositeItem.txtcomponenetNameLst || [],
                                components: compositeItem.components || [],
                                numPrice: itemPrice,
                                numCalculatedPrice: itemPrice,
                                numFinalPrice: itemPrice
                            });
                        }
                    });

                    // Get subcategory price - user override (numFinalPrice) or calculated from items (numPrice)
                    const activeSubCatPrice = activeFoodPrices[catId]?.subCategories?.[subCatId]?.numFinalPrice;
                    const userSubCatPrice = values.dtoFoodMenuPrices?.[catId]?.[subCatId];
                    const subCatNumPrice = subCatItemsTotal; // Sum of selected items
                    const subCatNumFinalPrice = (userSubCatPrice !== undefined && userSubCatPrice !== null && userSubCatPrice !== '' && userSubCatPrice != '0')
                        ? Number(userSubCatPrice)
                        : activeSubCatPrice && activeSubCatPrice || subCatNumPrice;

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

                // Get category price - user override (numFinalPrice) or calculated from subcategories (numPrice)
                const activeCatPrice = activeFoodPrices[catId]?.numFinalPrice;
                const userCatPrice = values.dtoCategoryPrices?.[catId];
                const catNumPrice = categoryTotalPrice; // Sum of subcategory final prices
                const catNumFinalPrice = (userCatPrice !== undefined && userCatPrice !== null && userCatPrice !== '' && userCatPrice != '0')
                    ? Number(userCatPrice)
                    : activeCatPrice && activeCatPrice || catNumPrice;

                foodTotalPrice += catNumFinalPrice;

                menuCategoriesSelection.push({
                    categoryId: category.categoryId,
                    categoryName: category.categoryName,
                    numPrice: catNumPrice,
                    numFinalPrice: catNumFinalPrice,
                    subCategories: subCategoriesPayload
                });
            });

            // Also build flat foodSelections for backward compatibility
            let allMenuItems = [];
            (lookupData.foodMenu || []).forEach(category => {
                (category.subCategories || []).forEach(subCat => {
                    (subCat.items || []).forEach(item => {
                        allMenuItems.push(item);
                    });
                });
            });

            // const flatMenuSelections = [];
            // Object.entries(values.dtoFoodMenu || {}).forEach(([catId, subCats]) => {
            //     Object.entries(subCats || {}).forEach(([subCatId, menuItemIds]) => {
            //         let ids = Array.isArray(menuItemIds) ? menuItemIds : [menuItemIds];
            //         ids.forEach(menuItemId => {
            //             if (menuItemId !== undefined && menuItemId !== null) {
            //                 const foundItem = allMenuItems.find(item => (item.serMenuItemId === menuItemId || item.parentMenuItemId === menuItemId));
            //                 if (foundItem) {
            //                     flatMenuSelections.push({
            //                         serMenuItemId: foundItem?.serMenuItemId || foundItem?.parentMenuItemId,
            //                         txtCode: foundItem?.txtCode || foundItem?.txtparentMenuItemCode,
            //                         txtName: foundItem?.txtName || foundItem?.txtparentMenuItemName,
            //                         txtDescription: foundItem?.txtDescription || foundItem?.txtparentMenuItemDesc,
            //                         blnIsSelectable: foundItem?.blnIsSelectable || false,
            //                         serParentMenuItemId: foundItem?.serParentMenuItemId || null,
            //                         numPrice: values.dtoFoodMenuPrices?.[catId]?.[subCatId] ?
            //                             Number(values.dtoFoodMenuPrices[catId][subCatId]) : 0
            //                     });
            //                 }
            //             }
            //         });
            //     });
            // });

            // const flatMenuSelections = [];
            // Object.values(values.dtoFoodMenu || {}).forEach(subCats => {
            //     Object.values(subCats || {}).forEach(menuItemId => {
            //         if (menuItemId !== undefined && menuItemId !== null) {
            //             const foundItem = allMenuItems.find(item => item.serMenuItemId === menuItemId);
            //             if (foundItem) {
            //                 flatMenuSelections.push({
            //                     serMenuItemId: foundItem?.serMenuItemId,
            //                     txtCode: foundItem?.txtCode,
            //                     txtName: foundItem?.txtName,
            //                     txtDescription: foundItem?.txtDescription,
            //                     blnIsSelectable: foundItem?.blnIsSelectable,
            //                     serParentMenuItemId: foundItem?.serParentMenuItemId,
            //                     numPrice: values.dtoFoodMenuPrices[catId][subCatId] ? Number(values.dtoFoodMenuPrices[catId][subCatId]) : dtoPrice[catId][subCatId]
            //                 });
            //             }
            //         }
            //     });
            // });

            // const { txtStatus, numQuotedPrice, numPaidAmount, ...rest } = values;

            // const dtoEventQuoteAndStatus = {
            //     txtStatus: txtStatus || '',
            //     numQuotedPrice: numQuotedPrice ? Number(numQuotedPrice) : 0,
            //     numPaidAmount: numPaidAmount ? Number(numPaidAmount) : 0,
            // }
            // const reqBody = {
            //     ...rest,
            //     serEventMasterId: eventData?.serEventMasterId || null,
            //     dteDeliveryDate: values?.dteDeliveryDate ? moment(values.dteDeliveryDate).format('DD-MM-YYYY') : null,
            //     dtoEventDecorSelections: decorSelections,
            //     dtoEventRunningOrder: runningOrderPayload,
            //     foodSelections,
            //     extrasSelections,
            //     dtoEventQuoteAndStatus
            // }
            let totalPrice = 0;
            if (values.numItineraryPrice) {
                totalPrice += Number(values.numItineraryPrice) || 0;
            }
            if (values.numServingDishesPrice) {
                totalPrice += Number(values.numServingDishesPrice) || 0;
            }

            values.dteDeliveryDate = moment(values.dteDeliveryDate).format('DD-MM-YYYY');

            let dtoEventQuoteAndStatus = {
                numQuotedPrice: totalPrice + foodTotalPrice,
            }
            // const formData = new FormData();
            // formData.append('eventMaster', JSON.stringify(reqBody));
            // if (false)
            //     formData.append('files', null);
            let reqBody = {
                ...values,
                serDeliveryBookingId: activeRow && activeRow?.serDeliveryBookingId,
                // foodSelections: flatMenuSelections,
                menuCategoriesSelection,
                dtoEventQuoteAndStatus,
            };

            delete reqBody.dtoFoodMenu;
            delete reqBody.dtoFoodMenuPrices;
            delete reqBody.dtoCategoryPrices;

            const data = await getSaveOrUpdateAdminPortal(reqBody);
            if (data && data?.code == 200) {
                setVisible(false);
                closeModal();
                getAllCateringTrigger();
                message.success(data?.message || 'Data saved successfully');
                setLoading(false);
            } else {
                setLoading(false);
                message.error(data?.message || 'Error in saving data');
            }

        } catch (err) {
            console.error('Srever error:', err?.message || 'Something went wrong');
            message.error('Failed to save caterings.');
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
            const eventUrl = label == 'client' ? eventClientSideUrl : eventReportUrl;
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

    const renderRunningOrderField = (field, label) => {
        if (selectedEventTypeId && RUNNING_ORDER_FIELD_MAPPING[selectedEventTypeId]?.includes(field)) {
            // if (RUNNING_ORDER_FIELD_MAPPING[selectedEventTypeId]?.includes(field)) {
            return (
                <Col span={8} key={field}>
                    <Form.Item name={['dtoEventRunningOrder', field]} label={label}>
                        <TimePicker
                            size='large'
                            format="HH:mm" style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            );
        }
        return null;
    };

    // if (loading && !eventData) {
    //     return <Spin size="large" style={{ marginTop: '50px', display: 'block', textAlign: 'center' }} />;
    // }

    return (
        <>
            {/* <PageHeader ghost title={eventId ? 'Edit Event Master' : 'Create New Event'} subTitle={'Event'} /> */}
            {/* <Main> */}
            <StyledFullModal
                title={isViewMode ? 'View Catering' : activeRow ? 'Edit Catering' : 'Add New Catering'}
                open={isModalVisible}
                onCancel={closeModal}
                footer={null}
                width="70vw"
                height="80vh"
            >
                {loading && !eventData && <Spin size="large" style={{ display: 'block', textAlign: 'center' }} />}
                <div style={{ background: '#fff', borderRadius: 8 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            dtoFoodMenu: {},
                            dtoFoodMenuPrices: {},
                            dtoCategoryPrices: {},
                        }}
                        disabled={isViewMode}
                        // name="myForm"
                        onFinishFailed={onFinishFailed}
                        scrollToFirstError
                    >
                        {/* Event Details */}
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end', }}>
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
                                    <Button Button type="primary" htmlType="submit"
                                        loading={!loaderLabel && loading}
                                    >
                                        {eventId ? 'Update' : 'Save'} Event
                                    </Button>
                                </div>
                            </Form.Item>
                        )}
                    </div> */}
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="txtDeliveryBookingCode"
                                    label="Catering Code">
                                    <Input
                                        type='text'
                                        placeholder='Enter event code'
                                        style={{
                                            backgroundColor: true ? "#f5f5f5" : "#fff",
                                            borderColor: "#d9d9d9",
                                            boxShadow: "none",
                                            opacity: .6,
                                        }}
                                        disabled={true} />
                                </Form.Item>
                            </Col>
                            {/* <Col span={8}>
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
                        </Col> */}
                            <Col span={8}>
                                <Form.Item name="serEventTypeId" label="Event Type" rules={[{
                                    required: true,
                                    message: 'please select type'
                                }]}>

                                    <Select
                                        onChange={(value) => {
                                            setSelectedEventTypeId(value)
                                        }}
                                        // disabled={!!eventId}
                                        placeholder="select type">
                                        {!!lookupData.eventTypes?.length && lookupData.eventTypes.map((event) => (
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
                            <Col span={8}>
                                <Form.Item name="dteDeliveryDate" label="Delivery Date" rules={[{ required: true }]}>
                                    {/* <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} /> */}
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        style={{ width: '100%', height: 46, padding: "10px !important" }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="numNumberOfGuests" label="Number of Guests" rules={[{ required: false }]}>
                                    <Input style={{ borderColor: "#d9d9d9", boxShadow: "none" }}
                                        type="number" onBlur={handleGuestTableChange} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="numNumberOfTables" label="Number of Tables" rules={[{ required: false }]}>
                                    <Input style={{ borderColor: "#d9d9d9", boxShadow: "none" }}
                                        type="number" onBlur={handleGuestTableChange} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="serCustId"
                                    label="Customer"
                                    rules={[{ required: true, message: 'please select customer' }]}
                                >
                                    <Select
                                        // disabled={!!eventId}
                                        placeholder="Please select customer">
                                        {
                                            // !!eventId ? lookupData.customers.map((item) => (
                                            //   <Option key={item.serCustId} value={item.serCustId}>
                                            //     {item.txtCustName || item.txtFirstName + ' ' + item.txtLastName}
                                            //   </Option>
                                            // )) :
                                            !!lookupData.customers?.length && lookupData.customers.filter(x => x.blnIsActive == true).map((item) => (
                                                <Option key={item.serCustId} value={item.serCustId}>
                                                    {item.txtCustName || item.txtFirstName + ' ' + item.txtLastName}
                                                </Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="txtDeliveryLocation" label="Location" rules={[{ required: false }]}>
                                    <Input style={{
                                        // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                                        borderColor: "#d9d9d9",
                                        boxShadow: "none",
                                    }} type="text" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="txtRemarks" label="Remarks" rules={[{ required: false }]}>
                                    <Input style={{
                                        // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                                        borderColor: "#d9d9d9",
                                        boxShadow: "none",
                                    }} type="text" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            {/* <Col span={8}>
                            <Form.Item
                                name="serVenueMasterId"
                                label="Venue"
                                rules={[{ required: false, message: 'Please select a venue' }]}
                            >
                                <Select placeholder="Select a venue">
                                    {lookupData.venues.filter(x => x.blnIsActive == true).map((venue) => (
                                        <Option key={venue.serVenueMasterId} value={venue.serVenueMasterId}>
                                            {venue.txtVenueName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}
                            {/* <Col span={8}>
                            <Form.Item
                                name="serVendorId"
                                label="Vendor"
                                rules={[{ required: false, message: 'Please select vendor' }]}
                            >
                                <Select placeholder="Select vendor">
                                    {lookupData.vendors.filter(x => x.blnIsActive == true).map((item) => (
                                        <Option key={item.serVendorId} value={item.serVendorId}>
                                            {item.txtVendorName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}
                        </Row>

                        {/* {!!selectedEventTypeId && <h2>Running Order</h2>}
                    <Row gutter={16}>
                        {renderRunningOrderField('txtGuestArrival', 'Guest Arrival')}
                        {renderRunningOrderField('txtBrideEntrance', 'Bride Entrance')}
                        {renderRunningOrderField('txtGroomEntrance', 'Groom Entrance')}
                        {renderRunningOrderField('txtDance', 'Dance')}
                        {renderRunningOrderField('txtMeal', 'Meal')}
                        {renderRunningOrderField('txtEndOfNight', 'End of Night')}
                    </Row> */}

                        {/* <div style={{ border: '2px solid #f5f5f5', borderRadius: '10px', padding: '15px' }}>
                        <h2>Decor Selections</h2>
                        <Row gutter={16}>
                            {lookupData.decor.filter(x => x.blnIsActive == true).map((cat) => (
                                <Col span={24} key={cat.serDecorCategoryId}>
                                    <div style={{ marginBottom: 20 }}>
                                        <h3>{cat.txtDecorCategoryName}</h3>
                                        <Row gutter={16}>
                                            {cat.categoryProperties.filter(x => x.blnIsActive == true).map((prop) => (
                                                <Col span={8} key={prop.serPropertyId}>
                                                    <Form.Item
                                                        name={['dtoEventDecorSelections', String(cat.serDecorCategoryId), String(prop.serPropertyId)]}
                                                        label={prop.txtPropertyName}
                                                        rules={[{ required: prop.blnIsRequired }]}
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
                    </div> */}
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
                                {!!lookupData.food?.length && lookupData.food.map((x, i) => (
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

                        {showFoodMenu && (
                            <div className='border-box'>
                                <h2>Food Menu</h2>
                                <Row gutter={16}>
                                    {!!lookupData?.foodMenu?.length && lookupData.foodMenu.map((cat) => {
                                        const activeCatPrice = activeFoodPrices[cat.categoryId]?.numFinalPrice;

                                        return (
                                            <Col span={24} key={cat.categoryId}>
                                                <div style={{ marginBottom: 20 }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
                                                        <div style={{
                                                            display: 'flex', alignItems: 'center'
                                                        }}>
                                                            <h3 style={{ margin: 0 }}>{cat.categoryName}</h3>
                                                            <Form.Item
                                                                className='bgClr'
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
                                                        </div>
                                                        {activeCatPrice !== undefined && activeCatPrice !== null && (
                                                            <h5 style={{ margin: '2px 0 0 0', color: '#666' }}>Default Price: £{activeCatPrice}</h5>
                                                        )}
                                                    </div>
                                                    <Row gutter={16}>
                                                        {cat.subCategories.map((prop) => {
                                                            const selectedItems = foodMenuSelections[cat.categoryId]?.[prop.subCategoryId] || [];
                                                            const calculatedSubCatPrice = calculateFoodSubcategoryPrice(cat.categoryId, prop.subCategoryId, selectedItems, lookupData.foodMenu);
                                                            const activeSubCatPrice = activeFoodPrices[cat.categoryId]?.subCategories?.[prop.subCategoryId]?.numFinalPrice;

                                                            return (
                                                                <Col span={8} key={prop.subCategoryId}>
                                                                    <Form.Item
                                                                        name={['dtoFoodMenu', String(cat.categoryId), String(prop.subCategoryId)]}
                                                                        label={<>
                                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
                                                                                    {prop.subCategoryName}
                                                                                    <Form.Item
                                                                                        className='bgClr'
                                                                                        name={['dtoFoodMenuPrices', String(cat.categoryId), String(prop.subCategoryId)]}
                                                                                        rules={[{ required: false }]}
                                                                                        style={{
                                                                                            padding: 0, margin: 0,
                                                                                        }}
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
                                                                                </div>
                                                                                <h5 style={{ margin: '2px 0 0 0', color: '#666', fontSize: 11 }}>
                                                                                    Items Total: £{calculatedSubCatPrice || 0}
                                                                                </h5>
                                                                                {activeSubCatPrice !== undefined && activeSubCatPrice !== null && (
                                                                                    <h5 style={{ margin: '2px 0 0 0', color: '#666', fontSize: 11 }}>Default Price: £{activeSubCatPrice}</h5>
                                                                                )}
                                                                            </div>
                                                                        </>}
                                                                        rules={[{ required: prop.blnIsRequired }]}
                                                                    >
                                                                        <Select
                                                                            mode="multiple" allowClear
                                                                            placeholder={`Select ${prop.subCategoryName}`}
                                                                            optionLabelProp="label"
                                                                            onChange={(selectedIds) => handleFoodSelectionChange(cat.categoryId, prop.subCategoryId, selectedIds)}
                                                                        >
                                                                            {prop.items.map((val) => (
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
                                                                                        <span style={{ display: 'flex' }}>{val.txtName || val.txtparentMenuItemName || ''}</span>
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
                            </div>
                        )}
                        <div className='border-box'>
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
                        </div>
                        {activeRow && <div className='border-box'>
                            <h2>Catering Cost</h2>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="txtStatus"
                                        label="Status"
                                        rules={[{ required: false, message: 'Please select a venue' }]}
                                    >
                                        <Select placeholder="Select status"
                                            disabled={true}
                                        >
                                            <Option value={'Enquiry'}>Enquiry</Option>
                                            <Option value={'Quoted'}>Quoted</Option>
                                            <Option value={'Confirmed'}>Confirmed</Option>
                                            {/* {lookupData.venues.map((venue) => (
                        <Option key={venue.serVenueMasterId} value={venue.serVenueMasterId}>
                          {venue.txtVenueName}
                        </Option>
                      ))} */}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="numQuotedPrice" label="Qouted Amount"
                                        rules={[{ required: false }]}>
                                        <Input style={{
                                            // backgroundColor: eventId ? "#f5f5f5" : "#fff",
                                            borderColor: "#d9d9d9",
                                            boxShadow: "none",
                                        }} type="text"
                                            disabled="true"
                                            onChange={(e) => {
                                                if (eventId)
                                                    return
                                                if (e.target.value > 0) {
                                                    form.setFieldValue('txtStatus', 'Quoted')
                                                } else {
                                                    form.setFieldValue('txtStatus', 'Enquiry')
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>}

                        {/* <div className='border-box'>
                        <h2>Extras Selections</h2>
                        <Row gutter={16}>
                            {lookupData?.extras?.map((extra) => (
                                <Col span={8} key={extra.serExtrasId}>
                                    <Form.Item
                                        key={extra.serExtrasId}
                                        name={['extrasSelections', String(extra.serExtrasId)]}
                                        label={extra.txtExtrasName}
                                    >
                                        <Select placeholder={`Select option for ${extra.txtExtrasName}`}>
                                            {extra.decorExtrasOptions?.map((opt) => (
                                                <Option key={opt.serExtraOptionId} value={opt.serExtraOptionId}>
                                                    {opt.document?.txtDocumentUrl ? (
                                                        <img src={opt.document.txtDocumentUrl} alt={opt.txtOptionName} style={{ height: 40 }} />
                                                    ) : (
                                                        opt.txtOptionName
                                                    )}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </div> */}

                        {/* <div className='border-box'>
                        <h2>Event Cost</h2>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    name="txtStatus"
                                    label="Status"
                                    rules={[{ required: false, message: 'Please select a venue' }]}
                                >
                                    <Select placeholder="Select status"
                                        disabled={true}
                                    >
                                        <Option value={'Enquiry'}>Enquiry</Option>
                                        <Option value={'Quoted'}>Quoted</Option>
                                        <Option value={'Confirmed'}>Confirmed</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="numQuotedPrice" label="Qouted Price" rules={[{ required: false }]}>
                                    <Input style={{
                                        borderColor: "#d9d9d9",
                                        boxShadow: "none",
                                    }} type="number"
                                        onChange={(e) => {
                                            if (eventId)
                                                return
                                            if (e.target.value > 0) {
                                                form.setFieldValue('txtStatus', 'Quoted')
                                            } else {
                                                form.setFieldValue('txtStatus', 'Enquiry')
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="numPaidAmount" label="Paid Amount" rules={[{ required: false }]}>
                                    <Input style={{
                                        borderColor: "#d9d9d9",
                                        boxShadow: "none",
                                    }} type="number"
                                        onChange={(e) => {
                                            if (eventId)
                                                return
                                            if (e.target.value > 0) {
                                                form.setFieldValue('txtStatus', 'Confirmed')
                                            } else {
                                                form.setFieldValue('txtStatus', 'Enquiry')
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                    </div> */}
                        {/* {true && (
              <Form.Item style={{ marginTop: '15px' }}>

              </Form.Item>
            )} */}

                        {activeRow?.serDeliveryBookingId && (
                            <div className='border-box'>
                                {/* <h2>Amount</h2> */}
                                <div style={{ display: 'flex', padding: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h3>Amount</h3>
                                    {!isViewMode && (
                                        <Button
                                            type="dashed"
                                            icon={<PlusOutlined />}
                                            onClick={() => {
                                                setActivePaymentRow(null);
                                                setPaymentModalVisible(true);
                                            }}
                                        >
                                            Add Payment Info
                                        </Button>
                                    )}
                                </div>
                                <Table
                                    dataSource={arrPayment || []}
                                    rowKey={(record, idx) => record.serCateringPaymentId || idx}
                                    bordered
                                    pagination={true}
                                    columns={[
                                        {
                                            title: 'Date',
                                            dataIndex: 'dtePaymentDate',
                                            key: 'dtePaymentDate',
                                        },
                                        {
                                            title: 'Amount (£)',
                                            dataIndex: 'numAmount',
                                            key: 'numAmount',
                                            render: (text) => text !== undefined ? Number(text).toFixed(2) : '--'
                                        },
                                        {
                                            title: 'Method',
                                            dataIndex: 'txtPaymentMode',
                                            key: 'txtPaymentMode',
                                        },
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
                                            render: (_, record) => !isViewMode && (
                                                <Button
                                                    size="small"
                                                    type="link"
                                                    onClick={() => {
                                                        setActivePaymentRow(record);
                                                        setPaymentModalVisible(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }
                                    ]}
                                />
                            </div>
                        )}
                    </Form>
                    <div style={{ display: 'flex', justifyContent: 'end', gap: '5px', marginTop: '30px' }}>
                        <Button onClick={closeModal} htmlType="button" >
                            {'Close'}
                        </Button>
                        {!isViewMode && <Button type="primary" htmlType="submit"
                            onClick={() => {
                                form.submit();
                            }}
                            loading={loading}>
                            {activeRow ? 'Update' : 'Save'} Catering
                        </Button>}
                    </div>
                </div >
            </StyledFullModal >
            {/* </Main > */}

            <PaymentFormModal
                visible={paymentModalVisible}
                activeEvent={activePaymentRow}
                arrPaymentMethods={arrPaymentMethods}
                onCancel={() => setPaymentModalVisible(false)}
                onSubmit={(payload, files, storedDocumentId) => handlePaymentSubmit(payload, files, storedDocumentId)}
                loading={paymentLoading}
            />
        </>
    );
};

export default BookedCateringForm;
