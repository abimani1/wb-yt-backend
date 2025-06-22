"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [yuData, setYuData] = useState(null);
  const[loader, setLoader] = useState(false);

  async function OnSubmit(e) {
    setLoader(true)
    e.preventDefault();
    const payload = {
      url,
    };
    try {
      let res = await fetch(
        "https://wb-yt-backend-production.up.railway.app/v1/api/download/getUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      setLoader(false)
      setYuData(data)
    } catch (e) {
      setLoader(false)
      console.log(e);
    }
  }

  function onChange(e) {
    setUrl(e.target.value);
  }

  function Loader(){
    return(
      <div className="loader"></div>
    )
  }
  return (
    <div className="page">
      <div className="container">
        <div className="row">
          <header>
            <h1>YUDOWNLOAD</h1>
          </header>
          <div >
            <div className="form-controler">
              <form onSubmit={(e) => OnSubmit(e)}>
                <h4>Enter the URL</h4>
                <input
                  type="tel"
                  value={url}
                  name="url"
                  onChange={(e) => onChange(e)}
                  placeholder="Enter the URL"
                />
                <button>Click</button>
              </form>
            </div>
            <div className="section-box">
              {loader ? 
                <Loader/>
                :
                yuData &&
                <div className="card">
                  <div className="card_body">
                    <div className="card_img">
                      <img src={yuData.thumbnail} alt="img" />
                    </div>
                    <div className="card_content">
                      <h1>{yuData.title}</h1>
                      <div>
                        <p>{yuData?.formats?.[0].quality} {yuData?.formats?.[0].type}</p>
                        <a href={yuData?.formats?.[0].url} target="_blank">Download <span></span></a>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
