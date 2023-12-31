import React, { useState ,useEffect } from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import "./ProductManagement.css";
import "./ViewProduct.css"
import  UserNav from './UserNav';
import { useNavigate } from "react-router-dom";
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';

function ViewProduct() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    const [product,setproduct]= useState([])

    const deleteProduct = async (productId) => {
    
      try {
        await axios.delete(`http://localhost:8000/api/products/deleteproduct/${productId}`);
        fetchproduct();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    const editProduct = (productId) => {
      /*console.log(productId)*/
      navigate(`/EdtProduct?productId=${productId}`);
    };


    const fetchproduct=async()=>{
      const res=await axios.get(`http://localhost:8000/api/products/getproductbyuserid/${localStorage.getItem('authid')}`)
      setproduct(res.data)
      /*console.log(res.data)
      console.log(res.data.productName)*/
    }
  
    useEffect(() => {
      
    fetchproduct()
    }, [category])

    const navigate=useNavigate()
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
      };

  return  (
  <div>
  <div>
      <UserNav/>
  </div>
  <div className='Add'>
          <div style={{marginTop:'50px'}}>
              <a href="/ViewProduct" style={{textDecorationColor:'black', color:'black', fontWeight:'bold',fontSize:'24px', fontFamily:'time new roman'}}>
                  View Product
              </a>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <a href="/AddProduct" style={{paddingleft:'25px', textDecorationColor:'black', color:'black', fontWeight:'bold',fontSize:'24px', fontFamily:'time new roman'}}>
                  Add Product
              </a>

                    </div>
                </div>
          <div className="table-container">
          <table className='viewproduct_table' style={{ marginLeft:'200px',width:'70%', marginTop:'50px'}}>
      <thead>
        <tr className='viewproduct_tr'>
        <th className='viewproduct_th'></th>
          <th className='viewproduct_th'>Product Name</th>
          <th className='viewproduct_th'>Price</th>
          <th className='viewproduct_th'>Product Type</th>
          <th className='viewproduct_th'>Category</th>
          <th className='viewproduct_th'>Brand</th>
          
          <th className='viewproduct_th'>Image</th>
          <th className='viewproduct_th'>Status</th>
          <th className='viewproduct_th'>Reason</th>
          <th className='viewproduct_th'></th>
        </tr>
      </thead>
      <tbody>
        {product.map((product, index) => (
          <tr key={index} className='view_table_tr'>
            <td className='viewproduct_td'> 
              < BiEditAlt style={{fontSize:'24px'}} onClick={() => editProduct(product._id)}/>
            </td>
            <td className='viewproduct_td'>{product.productName}</td>
            <td className='viewproduct_td'>{product.price}</td>
            <td className='viewproduct_td'>{product.productType}</td>
            <td className='viewproduct_td'>{product.category}</td>
            <td className='viewproduct_td'>{product.brand}</td>
            <td>
              <img src={`http://localhost:8000/${product.image}`} alt="Product" style={{ height: '50px' }} />
            </td>
            <td className='viewproduct_td'>{product.status}</td>
            <td className='viewproduct_td'>{product.reason}</td>
            <td className='viewproduct_td'>
              <MdDelete size={24} className='deleteicon' onClick={() => deleteProduct(product._id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
          </div>
          <div>
              
          </div>
          
</div>
)
}

export default ViewProduct