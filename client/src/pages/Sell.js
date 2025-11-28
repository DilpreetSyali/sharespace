import styles from "./Sell.module.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

function Sell() {
  const navigate = useNavigate();
  const [cat, setCat] = useState("table");
  const [id, setId] = useState("");
  const [cycle, setCycle] = useState(false);
  const [table, setTable] = useState(true);
  const [drafter, setDrafter] = useState(false);
  const [coat, setCoat] = useState(false);
  const [chair, setChair] = useState(false);
  const [other, setOther] = useState(false);
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    pname: "",
    pdate: "",
    pprice: "",
    pdetail: "",
    pcat: "",
    pimage: "",
    id: "",
  });
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token === "") {
      navigate("/");
    }
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_BASEURL}`,
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        const id = response.data.userid;
        setId(id);
        setData((prev) => {
          return { ...prev, id: id };
        });
        axios({
          method: "post",
          baseURL: `${process.env.REACT_APP_BASEURL}`,
          url: "/api/profile",
          data: { id: id },
        }).catch((err) => console.log(err));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    setData((prev) => {
      return { ...prev, pcat: cat, pimage: image };
    });
  }, [cat, image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  };
  const handleSubmit = () => {
    toast.loading("Processing", { duration: 2000 });
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_BASEURL}`,
      url: "/api/sell",
      data: { pdata: data, id: id },
    })
      .then(function (response) {
        toast.success("Product details updated successfully!");
        navigate("/");
      })
      .catch(function (error) {
        toast.error("Failed to update the details!");
        console.log("error caught in frontend from backend");
      });
  };
  return (
    <div id={styles.sellPage}>
      <div id={styles.sellBox}>
        <p className={styles.sellTitle}>Sell</p>
        <div className={styles.sellinput}>
          <span>Product name : </span>
          <input
            name="pname"
            type="text"
            placeholder="Product name"
            value={data.pname}
            onChange={handleChange}
          />
        </div>

        <div className={styles.sellinput}>
          <span>Product price : </span>

          <input
            name="pprice"
            type="number"
            placeholder="Rs. XYZ"
            value={data.pprice}
            onChange={handleChange}
          ></input>
        </div>
        <div className={styles.sellinput}>
          <span>Product info : </span>
          <input
            name="pdetail"
            type="text"
            placeholder="Product Description"
            onChange={handleChange}
          ></input>
        </div>
        <div className={styles.sellinput}>
          <span>Date bought : </span>
          <input
            name="pdate"
            type="date"
            placeholder="Date purchased"
            value={data.pdate}
            onChange={handleChange}
          ></input>
        </div>
        <div className={styles.checkboxes}>
          <label htmlFor="table">
            <input
              type="radio"
              name="table"
              onChange={(e) => {
                setTable(true);
                setCat("table");
                setOther(false);
                setChair(false);
                setCycle(false);
                setDrafter(false);
                setCoat(false);
              }}
              checked={table}
            />
            Table
          </label>

          <label htmlFor="cycle">
            <input
              type="radio"
              name="cycle"
              onChange={(e) => {
                setCycle(true);
                setCat("cycle");
                setOther(false);
                setChair(false);
                setTable(false);
                setDrafter(false);
                setCoat(false);
              }}
              checked={cycle}
            />
            Cycle
          </label>
          <label htmlFor="drafter">
            <input
              type="radio"
              name="drafter"
              onChange={(e) => {
                setDrafter(true);
                setCat("drafter");
                setOther(false);
                setChair(false);
                setCycle(false);
                setTable(false);
                setCoat(false);
              }}
              checked={drafter}
            />
            Drafter
          </label>
          <label htmlFor="chair">
            <input
              type="radio"
              name="chair"
              onChange={(e) => {
                setDrafter(false);
                setCat("chair");
                setOther(false);
                setChair(true);
                setCycle(false);
                setTable(false);
                setCoat(false);
              }}
              checked={chair}
            />
            Chair
          </label>
          <label htmlFor="coat">
            <input
              type="radio"
              name="coat"
              onChange={(e) => {
                setDrafter(false);
                setCat("coat");
                setOther(false);
                setChair(false);
                setCycle(false);
                setTable(false);
                setCoat(true);
              }}
              checked={coat}
            />
            Coat
          </label>
          <label htmlFor="other">
            <input
              type="radio"
              name="other"
              onChange={(e) => {
                setDrafter(false);
                setCat("other");
                setOther(true);
                setChair(false);
                setCycle(false);
                setTable(false);
                setCoat(false);
              }}
              checked={other}
            />
            Other
          </label>
        </div>

        <div className={styles.sellinput}>
          <span>Product image</span>
          <input
            type="file"
            name="pimage"
            accept="image/*"
            onChange={convertToBase64}
            style={{ border: "none" }}
          ></input>
        </div>

        {image === "" || image === null ? (
          ""
        ) : (
          <img src={image} alt="uploadedImage" />
        )}
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Sell;
