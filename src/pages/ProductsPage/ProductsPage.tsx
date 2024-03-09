import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './ProductsPage.module.scss'
import md5 from 'md5';
import { toast } from "react-toastify"
import CardsList from 'components/CardsList';
import MultiDropdown from 'components/MultiDropdown';
import Input from 'components/Input';
import Button from 'components/Button'
import SliderFilter from 'components/Slider';
import Pagination from 'components/Pagination';
import { ProductData } from '../../../types';
import { OptionData } from '../../../types';

const ProductsPage = () => {
    const [currentOffset, setCurrentOffset] = useState(0)
    const [products, setProducts] = useState<ProductData[]>([])
    const [allBrands, setAllBrands] = useState<OptionData[]>([])
    const [titleValue, setTitleValue] = useState('')
    const [brandValue, setBrandValue] = useState<OptionData[]>([])
    const [sliderValue, setSliderValue] = useState(100);
    const [isLoading, setIsloading] = useState(true)
    const [itemsCount, setItemsCount] = useState(0)
    const [filteredItemsCount, setFilteredItemsCount] = useState(0)
    const [isFilter, setIsFilter] = useState(false)

    const limit = 50

    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() +  1;
    const day = date.getUTCDate();
    
    const formattedDate = `${year}${month <  10 ? '0' : ''}${month}${day <  10 ? '0' : ''}${day}`

    const getUniqueProductsIds = (ids: string[]) => { // Возвращает массив уникальных ID
        const uniqueIds = [];
        const seenIds = new Set();
    
        for (const id of ids) {
            if (!seenIds.has(id)) {
                seenIds.add(id);
                uniqueIds.push(id);
            }
        }
    
        return uniqueIds;
    };

    const getAllIds = async () => {
        try {
            const response = await axios(`https://api.valantis.store:41000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_ids"
            }
        })
        setItemsCount(response.data.result.length)
        } catch (error) {
            console.error("Ошибка сервера:", error);
            getAllIds() // Long polling
        }
    }

    const getProductsIds = async () => {
        setIsloading(true)
        setIsFilter(false)
        try {
            const response = await axios(`https://api.valantis.store:41000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_ids",
                "params": {"offset": currentOffset, "limit": limit}
            }
        })
        getProducts(getUniqueProductsIds(response.data.result))
        } catch (error) {
            console.error("Ошибка сервера:", error);
            getProductsIds()
        }
    }
      
    const getProducts = async (ids: string[]) => {
        try {
            const response = await axios(`https://api.valantis.store:41000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_items",
                "params": {"ids": ids}
            }
        })

        setIsloading(false)
        setProducts(response.data.result)
        } catch (error) {
            console.error("Ошибка сервера:", error);
        }
    }

    const getBrands = async () => {
        try {
            const response = await axios(`https://api.valantis.store:41000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_fields",
                "params": {"field": "brand", "offset": 0}
            }
        })
        const filteredBrands = response.data.result.filter((brand: string) => brand !== null);
        const uniqueBrands = filteredBrands.filter((brand: string, index: number, self: string[]) => self.indexOf(brand) === index);
        const brandsAsKeyValueObjects = uniqueBrands.map((brand: string) => ({ key: brand, value: brand }));
        setAllBrands(brandsAsKeyValueObjects);
        } catch (error) {
            console.error("Ошибка сервера:", error);
            getBrands()
        }
    }

    const filterProducts = async (option: OptionData) => {
        setIsloading(true)
        setIsFilter(true)
        setCurrentOffset(0)
        try {
            const response = await axios(`https://api.valantis.store:41000/`, {
                method: 'POST',
                headers: {
                    'X-Auth' : md5(`Valantis_${formattedDate}`)
                },
                data: {
                    "action": 'filter',
                    "params": { [option.key]: option.value, "offset": 0, "limit": 50 }
                }
            })
            getProducts(getUniqueProductsIds(response.data.result))
            setFilteredItemsCount(response.data.result.length)
        } catch (error) {
            console.error("Ошибка сервера:", error);
        }
    }

    const handleBrandChange = (options: OptionData[]) => {
        const newValue = options[options.length - 1];
        if (newValue) {
            setBrandValue([newValue]);
        } else {
            setBrandValue([]);
        }
    };

    const getDropdownTitle = (options: OptionData[]) => {
        return options.map((option) => option.value).join(', ') || 'Выберите бренд*';
    };
    
    const handleSliderChange = (value: number) => {
        setSliderValue(value);
    };

    const handleSearchButtonClick = () => {
        if (sliderValue === 100 && !titleValue && brandValue.length === 0) {
            getProductsIds()
        }
        else if (sliderValue !== 100 && !titleValue && brandValue.length === 0) {
            filterProducts({key: 'price', value: sliderValue})
        } else if (sliderValue === 100 && titleValue && brandValue.length === 0) {
            filterProducts({key: 'product', value: titleValue})
        } else if (sliderValue === 100 && !titleValue && brandValue.length !== 0) {
            filterProducts({key: 'brand', value: brandValue[0].value})
        } else {
            toast.error('Фильтровать можно только по одному признаку!')
        }
    }

    const clearData = () => {
        setTitleValue('')
        setSliderValue(100)
        setBrandValue([])
    }

    useEffect(() => {
        getAllIds()
        getBrands()
    }, [])

    useEffect(() => {
        if (!isFilter) {
            getProductsIds()
        }
    }, [currentOffset])

    // Для фильтрации пагинация сделана без offset - API не позволяет

    const onFirstButtonClick = () => {
        setCurrentOffset(0)
    }
    
    const onPrevButtonClick = () => {
        setCurrentOffset(currentOffset - limit)
    }

    const onNextButtonClick = () => {
        setCurrentOffset(currentOffset + limit )
    }

    const onLastButtonClick = () => {
        if (isFilter) {
            setCurrentOffset((Math.ceil(filteredItemsCount / limit) - 1) * 50)
        } else {
            setCurrentOffset((Math.ceil(itemsCount / limit) - 1) * 50)
        }
    }

    return (
        <div className={styles.product__page}> 
            <div className={styles['product__page-wrapper']}>
                <h1 className={styles['product__page-title']}>Наши продукты</h1>
                <h3 className={styles['product__page-subtitle']}>Здесь вы можете ознакомиться с продукцией нашей компании! У нас много скидок и новинок</h3>
                <h3 className={styles['product__page-caption']}>У вас есть возможность отфильтровать продукты по одному из признаков</h3>

                <div className={styles['product__page-filter']}>
                    <div className={styles['product__page-filter-search']}>
                        <Input className={styles['product__page-filter-input']} value={titleValue} placeholder='Название товара*' onChange={setTitleValue}/>
                        {allBrands && <MultiDropdown options={allBrands} value={brandValue} onChange={handleBrandChange} getTitle={getDropdownTitle}/>}
                        <SliderFilter
                            onChangeValue={handleSliderChange}
                            minimum={100}
                            slidervalue={sliderValue}
                            maximum={100000}
                            title="Цена товара:"
                        />
                    </div>

                    <div className={styles['product__page-filter-btns']}>
                        <Button className={styles['product__page-filter-btn']} onClick={handleSearchButtonClick}>Найти</Button>
                        <Button className={styles['product__page-filter-btn']} onClick={() => clearData()}>Очистить</Button>
                    </div>
                </div>

                {!isFilter ? 
                    <CardsList isLoading={isLoading} products={products}/>
                    : <CardsList isLoading={isLoading} products={products.slice(currentOffset, currentOffset + limit)}/>
                }

                {products.length === 0 && !isLoading && 
                    <h3 className={styles['product__page-subtitle']}>
                        Такого объекта не найдено...
                    </h3>
                }

                {!isLoading && <Pagination
                    pageCount={isFilter ? Math.ceil(filteredItemsCount / limit) : Math.ceil(itemsCount / limit)}
                    onFirstButtonClick={onFirstButtonClick}
                    onPrevButtonClick={onPrevButtonClick}
                    onNextButtonClick={onNextButtonClick}
                    onLastButtonClick={onLastButtonClick}
                    currentPage={Math.ceil(currentOffset / limit)}
                />}
            </div>
        </div>
    )
}

export default ProductsPage