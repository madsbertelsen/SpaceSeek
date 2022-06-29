import { RegularText } from '../../components/Basic/Basic';
import React, { useMemo } from 'react';
import * as RN from 'react-native';
import { spaceRoutes } from '../../navigators/routes';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonRound from '../../components/ButtonRound';
import Octicon from 'react-native-vector-icons/Octicons';
import { MapView } from '../../components/LaunchContent/MapView';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Svg, { Circle, Rect } from 'react-native-svg';
import { sortWaypoints } from '../../utils';
import { ScrollView } from 'react-native-gesture-handler';
import { WaypointList } from './WaypointList';
export interface DetailsScreenIncomeParamsProps {
  id?: string;
}
const strokeColor = 'black';

const RouteInfo = (feature: Feature) => {
  return (
    <>
      <RN.View
        style={{
          flexDirection: 'row',
          paddingVertical: 16,
        }}>
        <ButtonRound fontSize={25}>
          <Icon name="directions-walk" color="white" style={{ fontSize: 20 }} />
        </ButtonRound>

        <RegularText style={{ marginLeft: 16 }} size="xl" fontType="bold">
          {feature.name}
        </RegularText>
      </RN.View>

      <RN.View style={{ flexDirection: 'row' }}>
        <RN.View style={{ flexDirection: 'row' }}>
          <RegularText size="l" fontType="bold">
            <Octicon name="arrow-both" color="black" style={{ fontSize: 16 }} />
            {'  13,4 km'}
          </RegularText>
        </RN.View>

        <RN.View
          style={{
            flexDirection: 'row',
            marginLeft: 20,
          }}>
          <RegularText style={{ marginLeft: 10 }} size="l" fontType="bold">
            <Octicon
              name="clock"
              color="black"
              style={{ fontSize: 16, padding: 20 }}
            />
            {'  2 t 17'}
          </RegularText>
        </RN.View>
      </RN.View>
    </>
  );
};

export interface DetailsScreenProps {
  route?: {
    params?: DetailsScreenIncomeParamsProps;
  };
}

export const SectionContent = ({
  rel,
  context,
}: {
  rel: SubCategory;
  context: Feature;
}) => {
  const features = useSelector((state: RootState) => state.features.features);
  const nav = useNavigation();
  return (
    <>
      <>
        <RN.View
          style={{
            width: '100%',
            backgroundColor: rel.container_color
              ? rel.container_color
              : 'white',
          }}>
          <RN.View
            style={{
              width: '100%',
              backgroundColor: rel.header_color ? rel.header_color : 'gray',
              padding: 20,
              paddingBottom: 0,
            }}>
            <RegularText size="xxl" fontType="bold" backgroundColor="black">
              {rel.name}
            </RegularText>
          </RN.View>
          <RN.View style={{ marginTop: 0 }}>
            {rel.card_layout === 'vertical_waypoints' && (
              <WaypointList
                context={context}
                featureIds={rel.screens.map((s) => s.id)}
              />
            )}
            {rel.card_layout === 'vertical_routes' &&
              rel.screens.map((fe) => {
                const f = features.find((te) => te.id === fe.id)!;
                return (
                  <>
                    <RN.View style={{ padding: 20 }}>
                      <RN.Pressable
                        onPress={() => {
                          if (f.geometry.type === 'LineString') {
                            (nav as any).push(spaceRoutes.tourdetails, {
                              id: f.id,
                            });
                          } else {
                            (nav as any).push(spaceRoutes.details, {
                              id: f.id,
                            });
                          }
                        }}>
                        <RN.View
                          style={{
                            padding: 16,
                            backgroundColor: 'white',
                            shadowRadius: 8,
                            shadowOffset: [5, 5],
                            //     shadowOpacity: 0.3,
                            //     shadowColor: 'black',
                            // borderRadius: 8,
                          }}>
                          <MapView {...f} marginHorizontal={0} />
                          <RouteInfo {...f} />
                        </RN.View>
                      </RN.Pressable>
                    </RN.View>
                    <RN.View
                      style={{
                        height: 8,
                        flex: 1,
                        marginHorizontal: -16,
                      }}
                    />
                  </>
                );
              })}
          </RN.View>
        </RN.View>
      </>
    </>
  );
};
