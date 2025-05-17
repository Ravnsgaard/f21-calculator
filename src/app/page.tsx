import { Container, Typography } from "@mui/material";
import CostCalculator from "../components/CostCalculator";

export default function HomePage() {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        IDO Edge Cost Calculator
      </Typography>
      <CostCalculator />
    </Container>
  );
}
