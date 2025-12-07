import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { packageApi, IMAGE_BASE_URL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface PackageType {
  id: number;
  pkgName: string;
  pkgImage: string;
  creationDate: string;
}

const TourTypes = () => {
  const [packageTypes, setPackageTypes] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackageTypes = async () => {
      try {
        const response = await packageApi.getTypes();
        if (response.success) {
          setPackageTypes(response.data);
        }
      } catch (error) {
        console.error("Error fetching package types:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageTypes();
  }, []);

  const handleTypeClick = (typeId: number) => {
    navigate(`/tours?packagetype=${typeId}`);
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Explore Our Popular Tours
            </h2>
            <p className="text-base text-muted-foreground">
              One site{" "}
              <span
                className="bg-green
  text-green-950
  px-2 py-0.5
  rounded-full
  text-sm
  font-bold]"
              >
                35+
              </span>{" "}
              most popular experience you'll remember
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl w-[180px] h-[180px] mb-3"></div>
                <div className="h-5 bg-muted rounded w-32 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore Our Popular Tours
          </h2>
          <p className="text-base text-muted-foreground">
            One site{" "}
            <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-sm font-bold">
              35+
            </span>{" "}
            most popular experience you'll remember
          </p>
        </div>

        {/* <div className="flex flex-wrap justify-center gap-4">
          {packageTypes.map((type) => (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden w-[180px]"
              onClick={() => handleTypeClick(type.id)}
            >
              <CardContent className="p-0">
                <div className="relative w-[180px] h-[180px] overflow-hidden rounded-t-lg">
                  <img
                    src={`${IMAGE_BASE_URL}${type.pkgImage}`}
                    alt={type.pkgName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-lg font-bold text-foreground">
                    {type.pkgName}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div> */}

        <div className="w-full flex justify-center mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {packageTypes.map((type) => (
              <Card
                key={type.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                onClick={() => handleTypeClick(type.id)}
              >
                <CardContent className="p-0">
                  <div className="relative w-full max-h-[210px] aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={`${IMAGE_BASE_URL}${type.pkgImage}`}
                      alt={type.pkgName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm sm:text-lg font-bold text-foreground">
                      {type.pkgName}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourTypes;
