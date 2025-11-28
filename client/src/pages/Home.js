import styles from "./Home.module.scss";
import { Link } from "react-router-dom";
import search from "../assets/search.svg";
import table from "../assets/table.svg";
import cycle from "../assets/bicycle.svg";
import setsquare from "../assets/setsquare.svg";
import chair from "../assets/chair.svg";
import coat from "../assets/coat.svg";
import all from "../assets/all.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card/Card";
import { LoaderIcon, toast } from "react-hot-toast";

function Home() {
  const [loading, setLoading] = useState(true);
  const [searchval, setsearchval] = useState("");
  const [allProd, setAllProd] = useState([]);
  const [notificationData, setNotificationData] = useState(
    Array({
      prodId: "",
      href: "",
      imageURL: "",
      reg: 0,
      pname: "",
      bprice: 0,
      cancel: false,
      bid: "",
    })
  );
  const [disProd, setDisProd] = useState([]);
  const [valid, setValid] = useState(false);
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_BASEURL}`,
      url: "/api",
      data: { token: token },
    })
      .then(function (response) {
        setValid(true);
        setNotificationData(response.data.allNotifications);
        console.log(response.data.allNotifications);
      })
      .catch(function (error) {
        console.log(error);
        console.log("error caught in frontend from backend");
      });
    axios({
      method: "post",
      baseURL: `${process.env.REACT_APP_BASEURL}`,
      url: "/api/allprod",
      data: {},
    })
      .then(function (response) {
        setAllProd(response.data.details);
        setDisProd(response.data.details);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        console.log("error caught in frontend from backend");
      });
  }, []);

  const colorArray = [
    "#e1fff8",
    "#cefff4",
    "#d2f8fa",
    "#cefff4",
    "#bdfff1",
    "#d6cfff",
  ];
  const [notification, setNotification] = useState(false);
  const images = [table, cycle, setsquare, chair, coat, all];
  const [category, setCategory] = useState("all");
  const catId = ["table", "cycle", "drafter", "chair", "coat", "all"];
  const handleDisProd = (id) => {
    if (id === "all") {
      setDisProd(allProd);
      return;
    }
    const result = [];
    allProd.forEach((ele) => {
      if (ele.pcat === id) {
        result.push(ele);
      }
    });
    setDisProd(result);
  };
  return (
    <>
      {notification ? (
        notificationData.length === 0 ? (
          <>
            <div className={styles.noNotificationContainer}>
              No Notifications
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => {
                setNotification(false);
              }}
            />
          </>
        ) : (
          <>
            <div className={styles.notificationContainer}>
              {notificationData.map((ele) => {
                return (
                  <div className="flex flex-row">
                    <Link
                      key={ele.prodId}
                      to={ele.href}
                      className={styles.notifEl}
                    >
                      <img src={ele.imageURL} alt="product" />

                      <p>
                        {ele.reg} wants to buy your {ele.pname} for Rs.{" "}
                        {ele.bprice}
                      </p>
                    </Link>
                    <button
                      className={styles.crossNotifi}
                      value={`${ele.prodId}-${ele.bid}`}
                      onClick={(e) => {
                        const data = e.target.value.split("-");
                        console.log("NETETR");
                        setNotification(false);
                        const prodid = data[0];
                        const bid = data[1];
                        toast.loading("Processing", { duration: 4000 });
                        toast.success("Removed notification successfully");
                        axios({
                          method: "post",
                          baseURL: `${process.env.REACT_APP_BASEURL}`,
                          url: "/api/cancelnotification",
                          data: { prodid, bid },
                        })
                          .then(function (response) {
                            setNotificationData(response.data.allNotifications);
                          })
                          .catch(function (error) {
                            toast.error("Internal Error");
                            console.log(error);
                          });
                      }}
                    >
                      X
                    </button>
                  </div>
                );
              })}
            </div>
            <div
              className={styles.bgNotification}
              onClick={() => {
                setNotification(false);
              }}
            />
          </>
        )
      ) : (
        ""
      )}
      <nav id={styles.navbar}>
        <div id={styles.navLogo}>buyNsell</div>
        <div id={styles.searchBox}>
          <input
            value={searchval}
            onChange={(e) => {
              const val = e.target.value;
              setsearchval(val);
            }}
            placeholder="I am looking for ..."
          />
          <span
            onClick={() => {
              console.log("Clicked");
              axios({
                method: "post",
                baseURL: `${process.env.REACT_APP_BASEURL}`,
                url: "/api/searchproduct",
                data: { searchval: searchval },
              })
                .then(function (response) {
                  setAllProd(response.data.mysearchdata);
                  setDisProd(response.data.mysearchdata);
                })
                .catch(function (error) {
                  toast.error("Internal Error");
                  console.log(error);
                });
            }}
          >
            <img src={search} alt="search" />
          </span>
        </div>
        {valid ? (
          <div id={styles.navLinks}>
            <div
              onClick={() => {
                setNotification((prev) => !prev);
              }}
              style={{ cursor: "pointer" }}
            >
              Notification
            </div>
            <div>
              <Link to="/sell">Sell</Link>
            </div>
            <div>
              <Link id={styles.registerNav} to="/profile">
                Profile
              </Link>
            </div>
          </div>
        ) : (
          <div id={styles.navLinks}>
            <div>
              <Link to="/login">Login</Link>
            </div>
            <div>
              <Link id={styles.registerNav} to="/register">
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>
      <div id="home" className={styles.homePage}>
        <div id={styles.categories}>
          {images.map((element, index) => {
            return (
              <div
                key={index}
                className={styles.bannerImg}
                style={{ background: `${colorArray[index]}` }}
              >
                <img
                  id={catId[index]}
                  onClick={(e) => {
                    const id = e.target.id;
                    setCategory(id);
                    handleDisProd(id);
                  }}
                  src={images[index]}
                  alt={`${images[index]}`}
                />
              </div>
            );
          })}
        </div>
        <div id={styles.productTitle}>
          <span>Products : {category}</span>
        </div>
        <div id={styles.productsContainer}>
          {!loading ? (
            disProd.map((ele, ind) => {
              return <Card key={ind} ele={ele} />;
            })
          ) : (
            <div className={styles.loadingIc}>
              <LoaderIcon />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
