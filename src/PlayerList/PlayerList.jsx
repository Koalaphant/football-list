import React, { useState, useEffect } from "react";
import "./playerList.css";
import supabase from "../config/supabaseClient";

const PlayerList = () => {
  const [name, setName] = useState("");
  const [submittedNames, setSubmittedNames] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [emptyError, setEmptyError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("footballers")
          .select()
          .order("created_at", { ascending: true });

        if (error) {
          setFetchError("Could not fetch the projects");
        } else {
          setFetchError(null);

          // Extract names from data and set them
          if (data) {
            setSubmittedNames(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setFetchError("Could not fetch the projects");
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const subscription = supabase
      .channel("footballers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "footballers" },
        async (payload) => {
          const eventType = payload.eventType;
          if (eventType === "DELETE") {
            // Get the ID of the deleted item
            const deletedId = payload.old.id;
            // Update state to remove the deleted item
            setSubmittedNames((prevNames) =>
              prevNames.filter((item) => item.id !== deletedId)
            );
          } else {
            // If it's not a delete event, re-fetch the data
            try {
              const { data, error } = await supabase
                .from("footballers")
                .select()
                .order("created_at", { ascending: true });
              if (error) {
                console.error("Error fetching data:", error.message);
              } else {
                // Extract names from data and set them
                if (data) {
                  setSubmittedNames(data);
                }
              }
            } catch (error) {
              console.error("Error fetching data:", error.message);
            }
          }
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [setSubmittedNames]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length === 0) {
      setEmptyError(true);
    } else {
      setEmptyError(false);

      try {
        // Capitalize the first letter of the name
        const capitalizedFirstName =
          trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);

        const { data, error } = await supabase
          .from("footballers")
          .insert([{ name: capitalizedFirstName }]);

        if (error) {
          console.error("Error inserting name:", error.message);
        } else {
          setName("");

          // Trigger a re-fetch of the data after successful insertion
          const { data: newData, error: newError } = await supabase
            .from("footballers")
            .select();
          if (newError) {
            setFetchError("Could not fetch the updated data");
          } else {
            setFetchError(null);
            setSubmittedNames(newData.map((item) => item.name));
          }
        }
      } catch (error) {
        console.error("Error inserting name:", error.message);
      }
    }
  };

  return (
    <>
      <h1>Thursday Night Football</h1>

      {submittedNames.length >= 25 && (
        <p id="form-full">
          The form has been hidden because there are 14 or more entries.
        </p>
      )}
      {submittedNames.length < 25 && (
        <>
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
            />
            <button className="submit-btn" type="submit">
              Submit
            </button>
          </form>
        </>
      )}
      {emptyError && <p className="error">Please enter a name.</p>}
      <div className="name-section">
        {submittedNames.slice(0, 14).map((item, index) => {
          return (
            <div className="names" key={index}>
              <p>
                {index + 1}. {item.name}
              </p>
            </div>
          );
        })}
        {submittedNames.length > 14 && (
          <div className="reserves">
            <h2 className="reserves">Reserves</h2>
            {submittedNames.slice(14).map((item, index) => {
              return (
                <div className="names" key={index}>
                  <p>
                    {index + 15}. {item.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default PlayerList;
