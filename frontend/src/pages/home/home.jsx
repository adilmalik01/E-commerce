import './home.css'
import SingleProduct from '../../components/product';
import Footer from '../../components/footer';
import Arrival from '../../components/arrival';

const Home = () => {
    return (<>
        <div className="main flex justify-center flex-col items-center">
            <div className="container  w-11/12 py-20 min-h-full bg-[#f5f7f9]">
                <div style={{ height: "90vh" }} className="flex bgImage  ">
                    <div className=" w-1/2 flex justify-center items-center">
                        <div className="flex justify-center flex-col">
                            <h1 className="text-7xl  text-black/70 font-medium">New Product</h1>
                            <h1 className="text-7xl   text-red-500 font-semibold">2024.</h1>
                            <h4 className="text-1xl text-black/70  font-semibold">
                                Inventory system to control and manage products the <br />
                                ware house in real time and integrated to make it easier to  <br />
                                develop your business
                            </h4>
                        </div>
                    </div>
                </div>
                <div className=" gri  columns-3 p-2">
                    <img className='shadow' src="https://codsoft-landing-page-adil.netlify.app/images/watch.webp" alt="" />
                    <img className='shadow' src="https://codsoft-landing-page-adil.netlify.app/images/camera.webp" alt="" />
                    <img className='shadow' src="https://codsoft-landing-page-adil.netlify.app/images/bag.webp" alt="" />
                </div>
                <div className=" my-10 w-full min-h-36 flex gap-4  flex-col justify-center items-center text-center">
                    <h1 className='text-4xl font-medium'>Popular Product</h1>
                    <p className='text-black/70 font-normal'>Lorem ipsum sit amet consectetur adipisicing elit. Ab,<br />
                        minus similique eaque, unde aut maiores autem iste
                    </p>
                </div>
                <Arrival query={"Popular"} />
                <div className='w-full min-h-[10vh]'>
                    <div className=" my-10 w-full h-36 flex gap-4  flex-col justify-center items-center text-center">
                        <h1 className='text-4xl font-medium'>New Arrival Product</h1>
                        <p className='text-black/70 font-normal'>Lorem ipsum sit amet consectetur adipisicing elit. Ab,<br />
                            minus similique eaque, unde aut maiores autem iste
                        </p>
                    </div>
                </div>
                <Arrival query={"discounted"} />
                <div className='w-full min-h-[10vh] mt-3'>
                    <div className=" my-10 w-full min-h-36 flex gap-4  flex-col justify-center items-center text-center">
                        <h1 className='text-4xl font-medium'>Discounted Product</h1>
                        <p className='text-black/70 font-normal'>Lorem ipsum sit amet consectetur adipisicing elit. Ab,<br />
                            minus similique eaque, unde aut maiores autem iste
                        </p>
                    </div>
                </div>
                <Arrival query={"new arrival"} />
            </div>
            < Footer />




        </div>


    </>);
}

export default Home;