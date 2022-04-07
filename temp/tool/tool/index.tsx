import { Card, createStyles, Grid, Image, Paper, Text, useMantineTheme } from '@mantine/core';
import { Link } from 'remix';

import { ToggleColorSchemeIcon } from '~/components/ToggleColorScheme';

const useStyles = createStyles((theme) => {
  const isDark = theme.colorScheme === 'dark';

  return ({
    wrapper: {
      height: '100vh',
      padding: 0,
      margin: 0,
      overflow: 'overlay',
    },
    main: {
      maxWidth: '1000px',
      margin: 'auto'
    },
    card: {
      height: '100%',
      border: isDark ? '1px solid #495057' : '1px solid #e9ecef',
      transition: 'box-shadow 0.2s ease-in-out,transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.03) translateY(-3px)',
        boxShadow: '0 1px 2px rgb(0 0 0 / 3%), 0 2px 4px rgb(0 0 0 / 3%), 0 4px 8px rgb(0 0 0 / 3%), 0 8px 16px rgb(0 0 0 / 3%), 0 16px 32px rgb(0 0 0 / 3%), 0 32px 64px rgb(0 0 0 / 3%);'
      }
    },
    icon: {
      border: isDark ? '1px solid #495057' : '1px solid #e9ecef',
      height: 150,
      backgroundColor: isDark ? '#343a40' : '#f9f9fd'
    }
  });
});

const Tool = () => {
  const { classes } = useStyles();
  return (
    <Paper className={classes.wrapper} >
      <Paper p="xl" className={classes.main}>
        <div>
          <h1>Tools
            <ToggleColorSchemeIcon ml="md" style={{ display: 'inline' }} />
          </h1>
          <p>一些前端常用的工具</p>
        </div>
        <Grid mt="md" gutter="xl" grow >
          {[1, 2, '这是一个工具。这是一个工具。这是一个工具。这是一个工具。这是一个工具。这是一个工具。这是一个工具。这是一个工具。'].map((i) => {
            return <Grid.Col key={i} xs={12} sm={6} md={4}  >
              <Card
                radius={10}
                p="xl"
                component={Link}
                to={'./' + i}
                className={classes.card}
              >
                <Card.Section>
                  <div className={classes.icon}>

                  </div>
                </Card.Section>

                <Text weight={500} size="lg" m="md" align='center'>
                  工具
                </Text>

                <Text size="xs" align='center'>
                  {i}
                </Text>
              </Card>
            </Grid.Col>;
          })}
        </Grid>
      </Paper>
    </Paper>
  );
};

export default Tool;
