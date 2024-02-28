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
import { ProductData } from '../../../types';
import { OptionData } from '../../../types';

const ProductsPage = () => {
    const [currentOffset, setCurrentOffset] = useState(0)
    const [products, setProducts] = useState<ProductData[]>([])
    const [allBrands, setAllBrands] = useState<OptionData[]>([])
    const [titleValue, setTitleValue] = useState('')
    const [brandValue, setBrandValue] = useState<OptionData[]>([])
    const [sliderValue, setSliderValue] = useState(100);
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() +  1;
    const day = date.getUTCDate();
    
    const formattedDate = `${year}${month <  10 ? '0' : ''}${month}${day <  10 ? '0' : ''}${day}`

    const getProductsIds = async () => {
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_ids",
                "params": {"offset": currentOffset, "limit": 50}
            }
        })
        getProducts(response.data.result)
        } catch (error) {
            throw error
        }
    }
      
    const getProducts = async (ids: string[]) => {
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
            method: 'POST',
            headers: {
                'X-Auth' : md5(`Valantis_${formattedDate}`)
            },
            data: {
                "action": "get_items",
                "params": {"ids": ids}
            }
        })
        setProducts(response.data.result)
        } catch (error) {
            throw error
        }
    }

    const getBrands = async () => {
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
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
            throw error
        }
    }

    const filterProducts = async (option: OptionData) => {
        try {
            const response = await axios(`http://api.valantis.store:40000/`, {
                method: 'POST',
                headers: {
                    'X-Auth' : md5(`Valantis_${formattedDate}`)
                },
                data: {
                    "action": 'filter',
                    "params": { [option.key]: option.value, "offset": 0, "limit": 50 }
                }
            })
            getProducts(response.data.result)
        } catch (error) {
            throw error
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
        if (sliderValue !== 100 && !titleValue && brandValue.length === 0) {
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
        getProductsIds()
        getBrands()
    }, [])

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
                {products !== null && <CardsList products={products}/>}
            </div>
        </div>
    )
}

export default ProductsPage